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