# YatraGenie AI

India's AI Travel & Trip Planning Assistant.

**Budget bolo → YatraGenie tumhare liye complete trip plan kare.**

## Copy & run LIVE (MongoDB)

Full steps: **[COPY-AND-RUN.md](COPY-AND-RUN.md)**  
Folder tree (frontend first, then backend, then MongoDB): **[docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md)**

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env

# live database
docker compose up -d mongo
# server/.env already has:
#   MONGODB_URI=mongodb://127.0.0.1:27017/yatragenie
#   USE_IN_MEMORY_DB=false

npm install
npm run install:all
npm run seed
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:5000/api/v1/health  
- Swagger: http://localhost:5000/api/v1/docs  
- Demo login: `demo@yatragenie.ai` / `Travel@123`

## Stack

| | |
|---|---|
| Frontend | React, Vite, Tailwind, Framer Motion, Router, Axios, TanStack Query, Recharts, Lucide |
| Backend | Node, Express, Mongoose |
| Database | **MongoDB** (`yatragenie`) |
| AI | Google Gemini — **server only** |

## Contracts

- [docs/API.md](docs/API.md)
- [docs/FRONTEND.md](docs/FRONTEND.md)
- [docs/DESIGN.md](docs/DESIGN.md)
- [docs/DATABASE.md](docs/DATABASE.md)
- [REMIND.md](REMIND.md)
