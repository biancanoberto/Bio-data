# Backend Catalogo de Animais

API NestJS para catalogo de especies com Prisma, PostgreSQL e Supabase Storage.

## Stack do backend

- NestJS: framework principal da API.
- Prisma: ORM e controle de migrations.
- PostgreSQL: banco relacional usado pelo catalogo.
- Supabase Storage: armazenamento das imagens dos animais.
- Supabase Service Role: chave usada apenas no backend para operacoes de storage.
- Swagger: documentacao interativa da API em `/docs`.
- Jest: testes unitarios.

## Funcionalidades

- CRUD de animais
- Upload de imagem via `multipart/form-data`
- Persistencia de metadados de imagens
- Geracao de URL publica pelo Supabase Storage
- Categorias, biomas e status de conservacao
- Seed com dados iniciais e imagens
- Swagger para documentacao da API

## Ambiente

Crie o `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Variaveis esperadas:

```env
PORT=3000
DATABASE_URL="postgresql://postgres.project-ref:password@aws-1-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres"
SUPABASE_URL="https://project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

Notas:

- `DATABASE_URL` e usada pela API em runtime.
- `DIRECT_URL` e recomendada para migrations no Supabase.
- O bucket `images-animals` precisa existir no Supabase Storage.
- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend.

## Instalar

```powershell
npm install
npx prisma generate
```

## Banco de dados

Aplicar migrations usando `DIRECT_URL` quando existir:

```powershell
$env:DATABASE_URL = node -r dotenv/config -e "process.stdout.write(process.env.DIRECT_URL || process.env.DATABASE_URL || '')"
npx prisma migrate deploy
```

Rodar seed:

```powershell
npm run seed
npm run seed:images
```

O seed cria:

- categorias
- biomas
- status de conservacao
- cinco animais base
- imagens base no bucket `images-animals`

## Rodar

```powershell
npm run start:dev
```

API:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/docs
```

## Validar

```powershell
npm test
npm run build
```

## Endpoints principais

```text
GET    /animals
GET    /animals/:id
POST   /animals
PATCH  /animals/:id
DELETE /animals/:id
GET    /animals/:id/images
POST   /animals/:id/images
GET    /categories
GET    /biomes
GET    /conservation-statuses
```

## Docker opcional

O projeto possui `Dockerfile` e `docker-compose.yml` para rodar API + Postgres local:

```powershell
docker compose up --build
```

Parar containers:

```powershell
docker compose down
```

Parar e remover volume do banco:

```powershell
docker compose down -v
```

## Observacoes de seguranca

- Nao commite `.env`.
- Rotacione chaves caso tenham sido compartilhadas acidentalmente.
- A `SUPABASE_SERVICE_ROLE_KEY` deve existir apenas no backend.
