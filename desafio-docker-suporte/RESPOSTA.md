Olá aluno, tudo certo? Foram feitas correções importantes no seu Dockerfile e no docker-compose:

### No Dockerfile:

Corrigimos o diretório de trabalho no container, o comando de cópia do arquivo package.json para instalação das dependências, o comando `RUN npm install` para instalar as dependencias, e a cópia do restante da aplicação.

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
    image: mysql:5.7
    container_name: database
    tty: true
    restart: always
    volumes:
      - mysql:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql # entrypoint configurado para executar o arquivo 'init.sql'
    ports:
      - "3307:3306" # A exposição da porta não estava especificada corretamente, foi inserido para facilitar acesso por SGBD externos.
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

Agora, o docker-compose.yml e o Dockerfile estão configurados corretamente com todas as correções aplicadas para garantir que o ambiente Docker funcione de maneira consistente e estável, com verificação de saúde e dependências corretamente configuradas entre os serviços.

Espero que essa explicação tenha esclarecido os erros. Se precisar de mais alguma coisa, estou à disposição!
