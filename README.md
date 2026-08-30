# Basics Brazil

E-commerce fictício desenvolvido com React + TypeScript no frontend e Node.js + Express + PostgreSQL no backend.

O projeto inclui:
- catálogo de produtos
- cadastro e login de usuários
- perfil do usuário
- carrinho de compras
- cálculo de frete simulado
- checkout simulado
- pedidos e confirmação
- cadastro de produtos por usuários logados

## Stack utilizada

- Frontend: React, TypeScript, Vite, Bootstrap
- Backend: Node.js, Express, TypeScript
- Banco de dados: PostgreSQL
- Autenticação: JWT
- Upload de imagens: Multer

## Estrutura do projeto

```bash
.
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── docker-compose.yml
├── README.md
└── PLANEJAMENTO.md
```

## Requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js 20+
- npm
- Docker e Docker Compose (opcional, mas recomendado)
- PostgreSQL (se for rodar localmente sem Docker)

## Configuração do ambiente

### Backend
Crie um arquivo `.env` dentro de `backend/` com algo como:


### Frontend
Crie um arquivo `.env` dentro de `frontend/` com:

```env
VITE_API_URL=http://localhost:3001
```

## Executando com Docker Compose

Na raiz do projeto:

```bash
docker compose up --build
```

Isso irá subir:
- PostgreSQL
- backend em Node.js
- frontend em Vite

Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Executando manualmente

### 1) Iniciar o banco
Se você estiver usando o PostgreSQL localmente ou via Docker isolado, garanta que o banco exista com as credenciais do `.env`.

Se preferir usar Docker apenas para o banco:

```bash
docker compose up db
```

### 2) Iniciar o backend

```bash
cd backend
npm install
npm run dev
```

### 3) Iniciar o frontend

```bash
cd frontend
npm install
npm run dev
```

## Banco de dados

O projeto usa o arquivo de schema localizado em:

- `backend/src/db/schema.sql`

Esse arquivo cria as tabelas principais do sistema, como usuários, produtos, carrinho, pedidos e outros dados relacionados ao e-commerce.

## Rotas principais

### Backend
- `POST /auth/register` — cadastro de usuário
- `POST /auth/login` — login
- `GET /products` — listar produtos
- `POST /products` — cadastrar produto
- `GET /products/:id` — detalhar produto
- `POST /shipping/calculate` — simular frete
- `POST /orders` — criar pedido simulado
- `GET /orders/:id` — consultar pedido

### Frontend
- `/` — home
- `/login` — login
- `/register` — cadastro
- `/profile` — perfil do usuário
- `/cart` — carrinho
- `/checkout` — finalização da compra
- `/orders/:id` — confirmação do pedido

## Observações importantes

- O projeto usa um fluxo de checkout simulado. Não há processamento real de pagamento.
- As imagens dos produtos e avatar dos usuários são salvas na pasta `backend/uploads`.
- O backend ainda depende de um ambiente local para desenvolvimento. Para produção, seria necessário ajustar variáveis, armazenamento de imagens e banco externo.

## Scripts úteis

### Backend
```bash
cd backend
npm run dev
npx tsc --noEmit
```

### Frontend
```bash
cd frontend
npm run dev
npm run build
```

## Contribuição

Para contribuir com o projeto:

1. crie uma branch
2. faça suas alterações
3. rode a build relevante
4. abra um pull request

## Licença

Este projeto foi desenvolvido para fins de estudo e demonstração.
