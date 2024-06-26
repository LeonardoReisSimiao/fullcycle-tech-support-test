## Desafio Docker

O objetivo desse desafio é que ao executar `docker compose up` tudo deve ser criado por completo e os containers precisam depender um do outro para subirem.

Este projeto base possui diversos erros de Docker, por isso os ajustes estão apenas nos arquivos:

- Dockerfile
- docker-compose.yaml

Analise os dois arquivos, verifique o que está impedindo a execução dos containers e faça o fix necessário.

---

### Correção do desafio:

Para verificar se está tudo funcionando, você deverá rodar o projeto via docker-compose e posteriomente acessar o seu ambiente local:

Rode o comando:

```bash
docker compose up
```

Acesse a rota abaixo e uma lista de nomes deve ser impressa na tela:

```
localhost:8080
```
