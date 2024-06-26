## Desafio Golang

O objetivo deste desafio é que ao executar os testes já criados, todos devem passar com êxito. Analise os arquivos do projeto, os arquivos de configuração e faça o fix necessário.

### Restrições

- A versão do `Golang` deve ser mantida a `1.16`.
- As libs já presentes devem permanecer as mesmas
- Você poderá trocar as versões das libs já presentes

### Correção do desafio:

Para verificar se está tudo funcionando, você deverá rodar o projeto segundo os passos abaixo:

Rode o container do projeto:

```bash
docker compose up
```

Entre no container:

```bash
docker compose exec app bash
```

Instale as dependências:

```bash
go mod tidy
```

Rode os testes:

```bash
go test ./...
```

O output esperado é a execução de todos os testes sem nenhum tipo de erro.
