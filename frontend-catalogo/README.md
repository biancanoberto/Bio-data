# Frontend Catalogo

Aplicacao React + TypeScript + Tailwind CSS para consumir a API do catalogo de especies.

## Stack do frontend

- React: biblioteca principal para construcao da interface.
- TypeScript: tipagem estatica dos componentes, hooks, services e respostas da API.
- Vite: servidor de desenvolvimento e build do frontend.
- Tailwind CSS: estilização utilitaria e responsiva.
- Axios: cliente HTTP para consumo da API.
- React Router: rotas de listagem, dashboard, cadastro, edicao e detalhe.
- Recharts: graficos do dashboard.
- React Hook Form: controle performatico dos formularios.
- Zod: validacao dos dados do formulario.
- Lucide React: icones da interface.

## Funcionalidades

- Listagem de especies em cards e tabela
- Busca por nome popular ou cientifico
- Filtro por categoria
- Paginacao
- Dashboard com graficos responsivos
- Analise por categoria, status e bioma
- Cadastro e edicao de especies
- Upload de imagem
- Detalhe e remocao de especie
- Estados de loading, erro e lista vazia

## Ambiente

Crie o `.env` local:

```powershell
Copy-Item .env.example .env
```

Variavel esperada:

```env
VITE_API_URL="http://localhost:3000"
```

Observacao: variaveis `VITE_` sao publicas no bundle do navegador. Nao coloque segredos aqui.

## Instalar

```powershell
npm install
```

## Rodar

```powershell
npm run dev
```

URL local padrao:

```text
http://localhost:5173
```

## Validar

```powershell
npm run lint
npm run build
```

O build gera a pasta `dist`.

## Deploy na Vercel

Configuracao recomendada no painel da Vercel:

```text
Root Directory: frontend-catalogo
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Configure a variavel de ambiente na Vercel:

```env
VITE_API_URL="https://url-do-backend-em-producao"
```

Como o projeto usa React Router, mantenha um `vercel.json` com rewrite para SPA:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Comandos uteis

```powershell
npm run dev
npm run lint
npm run build
npm run preview
```
