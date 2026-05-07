# Desafio Tecnico - Catalogo de Especies

Sistema full stack para catalogo de especies, organizado em duas aplicacoes independentes: frontend e backend.

## Estrutura

```text
desafio-tecnico/
  backend-catalogo/
    README.md
  frontend-catalogo/
    README.md
  .gitignore
  README.md
```

## Onde encontrar as instrucoes

Cada aplicacao possui seu proprio README com stack, variaveis de ambiente, comandos de execucao e validacao.

- Backend: [backend-catalogo/README.md](backend-catalogo/README.md)
- Frontend: [frontend-catalogo/README.md](frontend-catalogo/README.md)

## Como rodar rapidamente

Backend:

```powershell
cd backend-catalogo
npm install
Copy-Item .env.example .env
npx prisma generate
npm run start:dev
```

Swagger:

```text
http://localhost:3000/docs
```

Frontend:

```powershell
cd frontend-catalogo
npm install
Copy-Item .env.example .env
npm run dev
```

Aplicacao:

```text
http://localhost:5173
```

## Observacoes importantes

- Configure o `.env` do backend antes de rodar migrations, seed ou API.
- O frontend consome a API pela variavel `VITE_API_URL`.
