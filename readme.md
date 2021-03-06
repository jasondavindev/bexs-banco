# Bexs Banco API

## Tecnologias

- Node.js
- Docker & Docker compose
- Express.js (servidor HTTP)
- Winston (gerenciador de logs)
- Jest (testes)
- Prettier (linter)
- GitHub Actions

## Executando aplicação (com docker)

Instale os pacotes necessários

```bash
make install
```

Inicie a aplicação

```bash
make run
```

Buildando aplicação

```bash
make build
```

Executando modo CLI

```bash
make run/cli
```

Executando testes

```bash
make test
```

## Rotas
As rotas se encontram no arquivo `bexs-banco-api-postman.json`. Importe para o [Postman](https://www.postman.com/) e execute seus testes.

## Estrutura do projeto

```
src
├── api           # modulo da aplicação REST
│   ├── route     # dominio de rotas
│   ├── server.ts # aplicação http
│   └── util      # pacotes adicionais (error handler e gerenciador de arquivos)
├── cli           # modulo de aplicação CLI
├── lib           # regra de negócio (algoritmo de grafos)
└── shared        # pacotes compartilhados entre aplicação REST e CLI
└── common        # pacotes auxiliares (log manager)
```
