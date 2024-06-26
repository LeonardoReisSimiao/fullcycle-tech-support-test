FROM node:18-slim


# Foi corrigido o diretório de trabalho no container
WORKDIR /app

# Inserido a cópia de package.json e package-lock.json para instalar as dependencias necessárias
COPY package*.json .

# Instalar dependências
RUN npm install

# Copiado o restante da aplicação

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
