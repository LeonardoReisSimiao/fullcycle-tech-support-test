const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

const config = {
  host: "database",
  port: "3306",
  user: "root",
  password: "root",
  database: "database",
};

const maxRetries = 5; // 5 tentativas
const retryInterval = 20 * 1000; // 20 segundos

let connection;
let retryCount = 0;

async function connectToDatabase() {
  return new Promise((resolve, reject) => {
    connection = mysql.createConnection(config);
    connection.connect((err) => {
      if (err) {
        console.error(
          "Tentativa: " + retryCount + ". Erro ao conectar ao banco de dados:",
          err
        );
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Tentando a conexão novamente em ${retryInterval}ms...`);
          setTimeout(() => resolve(connectToDatabase()), retryInterval);
        } else {
          reject(
            new Error("Falha ao conectar ao Banco após o máximo de tentativas")
          );
        }
      } else {
        console.log("Conectado ao banco de dados com sucesso!");
        resolve(connection);
      }
    });
  });
}

async function sqlInsert(connection) {
  const sql = "INSERT INTO people (name) VALUES ?";
  const peoples = [["Obi-Wan Kenobi"], ["R2-D2"], ["Darth Vader"]];

  return new Promise((resolve, reject) => {
    connection.query(sql, [peoples], (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Foram inseridas ${result.affectedRows} pessoas!`);
        resolve(result);
      }
    });
  });
}

async function sqlSelect(connection) {
  const sql = "SELECT * FROM people";
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function listPeople(connection) {
  const allPeople = await sqlSelect(connection);
  console.log(allPeople);
  return allPeople;
}
app.get("/", async (req, res) => {
  try {
    const peoples = await listPeople(connection);
    const listPeoples =
      "<ul>" +
      peoples.map((item) => `<li align="center">${item.name}</li>`).join("") +
      "</ul>";
    res.send(`<h1 align="center">Full Cycle Rocks!</h1>\n${listPeoples}`);
  } catch (error) {
    console.error("Erro ao listar pessoas:", error);
    res.status(500).send("Erro ao listar pessoas");
  }
});
app.listen(port, async () => {
  console.log(`Ouvindo na porta: ${port}`);
  try {
    await connectToDatabase();
    await sqlInsert(connection);
  } catch (error) {
    console.error("Erro na inicialização do servidor:", error);
    process.exit(1); // Finaliza o processo em caso de erro crítico
  }
});
