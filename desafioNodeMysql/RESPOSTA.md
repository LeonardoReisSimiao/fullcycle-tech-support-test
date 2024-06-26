Olá aluno, tudo certo? Foram feitas algumas correções:

## No package.json

Foram observados alguns detalhes importantes:

Ao executar sua aplicação com `nodemon`, utilizamos normalmente o comando `npm run dev`, mas recebi o seguinte erro:

```sh
npm ERR! Missing script: "dev"
npm ERR!
npm ERR! To see a list of scripts, run:
npm ERR! npm run
```

Esse erro indica que estão faltando scripts no `package.json`. Para corrigir, foi adicionado o script `"dev": "nodemon index.js"` para rodar o servidor nodemon com o comando `npm run dev`.

**Observações:**

1. A dependência `nodemon` estava em `dependencies`, mas essa ferramenta é mais comumente utilizada como uma `devDependencies` para facilitar o desenvolvimento.
2. Caso queira, também poderá atualizar a versão do `nodemon` para `3.0.1`.

Após consertar esse erro, consegui executar o `npm run dev`, mas logo no início da aplicação recebi o erro:

```sh
code: 'ER_NOT_SUPPORTED_AUTH_MODE',
errno: 1251,
sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client',
sqlState: '08004',
fatal: true
```

Isso significa que a versão do módulo/driver que estamos usando para nos conectarmos com o banco não é compatível com o protocolo de autenticação dele. Para corrigir esse erro, foi realizado um upgrade do `mysql` v2.18.1 para o `mysql2` v3.6.1. Com isso, também atualizei no `index.js` a linha 13 para:

```javascript
const mysql = require("mysql2");
```

É importante lembrar que a dependência `mysql` foi descontinuada, o que pode gerar problemas de segurança e compatibilidade no futuro.

Como alteramos manualmente nosso `package.json`, é importante atualizarmos as dependências no `package-lock.json`. Para isso, devemos executar o comando `npm install` fora do container e verificar se a aplicação executará sem erros. Após isso, poderá excluir o `node_modules` caso ele não esteja no `.dockerignore`.

Em sua aplicação, me dei a liberdade de refatorá-la um pouco para realizar tentativas de conexão ao banco antes de ser finalizada por algum erro. Fiz duas versões refatoradas. Caso deseje ainda utilizar seu código inicial, poderá inserir em `scripts` do `package.json` o seguinte código:

```json
"dev": "nodemon --exitcrash --delay 3 index.js"
```

Isso fará o `nodemon` reiniciar automaticamente com um delay de 3 segundos caso ocorra qualquer erro na aplicação. Outra alternativa seria inserir um `script.sh` para realizar essa reinicialização.

Além dessas tentativas de conexão, inseri a pasta `database` com o arquivo `init.sql` contendo o código:

```sql
CREATE DATABASE IF NOT EXISTS database;

USE database;

CREATE TABLE IF NOT EXISTS people (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);
```

Pois em nenhum momento da sua aplicação estava sendo criada a tabela `people`, que será utilizada pela aplicação para inserção dos dados. Não se preocupe com a inicialização e execução desse .sql pois está configurado no docker-compose sua execução automática.

### No Dockerfile:

Corrigi o diretório de trabalho no container, o comando de cópia do arquivo package.json para instalação das dependências, o comando `RUN npm install` para instalar as dependencias, e a cópia do restante da aplicação.

Exemplo de Dockerfile corrigido:

```dockerfile
# Usando a imagem base do Node.js
FROM node:18-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Exposição da porta a ser utilizada
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
```

### No docker-compose.yml:

No serviço `app`, foram corrigidos o contexto para `./`, adicionada a exposição da porta com `ports`, e inserida a condição `depends_on` e `service_healthy` para esperar que o serviço `database` seja iniciado corretamente antes do `app`.

No serviço `nginx`, foi adicionada a condição `depends_on` apenas para o serviço `app`.

No serviço `database`, foi corrigida a linha de volumes para incluir a inicialização do arquivo `init.sql` e adicionado um `healthcheck` para verificar se o sistema foi iniciado completamente antes de iniciar o próximo serviço.

Exemplo de docker-compose.yml corrigido:

```yaml
version: "3"

services:
  app:
    build: ./app # Correção da localização
    container_name: app
    tty: true
    volumes:
      - ./app:/usr/src/app
    ports:
      - "3000:3000" # A exposição da porta não estava especificada corretamente
    depends_on:
      database:
        condition: service_healthy # inserido uma condição para esperar o 'database' iniciar corretamente antes do serviço ser iniciado
    restart: on-failure

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    depends_on:
      app:
        condition: service_started # condição para esperar o 'app' iniciar

 database:
    image: mysql:8.0
    container_name: database
    tty: true
    restart: on_failure
    volumes:
      - mysql:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql # entrypoint configurado para executar o arquivo 'init.sql'
    ports:
      - "3306:3306" # A exposição da porta não estava especificada corretamente, foi inserido para facilitar acesso por SGBD externos.
    environment:
      - MYSQL_DATABASE=nodedb
      - MYSQL_ROOT_PASSWORD=root
    healthcheck: # verificação se o sistema foi iniciado completamente antes de iniciar o próximo serviço. Foi inserido um periodo de espera longo visualizando a primeira execução do docker.
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -uroot -proot"]
      interval: 10s
      timeout: 15s
      retries: 5
      start_period: 300s

volumes:
  mysql:
    driver: local

```

Agora, toda sua aplicação está configurada corretamente com todas as correções aplicadas para garantir que o ambiente Docker funcione de maneira consistente e estável, com verificação de saúde e dependências corretamente configuradas entre os serviços.

Espero que essa explicação tenha esclarecido os erros. Se precisar de mais alguma coisa, estou à disposição!
