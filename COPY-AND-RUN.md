# Copy this project and run it LIVE (MongoDB)

Saara source already `client/` + `server/` mein hai. Niche wale steps apne laptop / VS Code pe copy karke live chalao.

## 0. Copy

```bash
git clone https://github.com/naveenkashyap2/MERN-portfolio.git
cd MERN-portfolio
git checkout arena/01a01522-mern-portfolio
```

Ya poora folder zip se extract karo (node_modules mat copy karo).

## 1. MongoDB LIVE

### Option A — Docker (easiest)

```bash
docker compose up -d mongo
```

URI:

```
mongodb://127.0.0.1:27017/yatragenie
```

### Option B — MongoDB Atlas (cloud, production-style)

1. https://cloud.mongodb.com pe free cluster banao  
2. Database Access → user + password  
3. Network Access → `0.0.0.0/0` (dev)  
4. Connect → Drivers → URI copy:

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/yatragenie
```

### Option C — Local MongoDB installed

```
mongodb://127.0.0.1:27017/yatragenie
```

## 2. Backend env

```bash
cp server/.env.example server/.env
```

`server/.env` mein ye set karo:

```
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

MONGODB_URI=mongodb://127.0.0.1:27017/yatragenie
USE_IN_MEMORY_DB=false

CLIENT_URL=http://localhost:5173
JWT_SECRET=change-me-access-secret-min-32-chars-long
REFRESH_TOKEN_SECRET=change-me-refresh-secret-min-32-chars

GEMINI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Atlas use kar rahe ho to `MONGODB_URI` wahi paste karo.  
`USE_IN_MEMORY_DB` **hamesha false** rakho jab Mongo live chahiye.

## 3. Frontend env

```bash
cp client/.env.example client/.env
```

```
VITE_API_BASE_URL=/api/v1
VITE_GOOGLE_CLIENT_ID=
```

Vite `/api` ko backend `:5000` pe proxy karta hai — browser mein localhost mat hardcode karo.

## 4. Install + seed + run

```bash
npm install
npm run install:all

# optional demo user + Delhi→Agra trip + catalog into Mongo
npm run seed

# frontend + backend together
npm run dev
```

Open:

- App: http://localhost:5173  
- API health: http://localhost:5000/api/v1/health  
- DB health: http://localhost:5000/api/v1/health/database  
- Swagger: http://localhost:5000/api/v1/docs  

Demo login after seed:

```
email:    demo@yatragenie.ai
password: Travel@123
```

## 5. Live checklist

| Check | Expected |
|--------|----------|
| `GET /api/v1/health/database` | `"inMemory": false` |
| Register / login | User document in `users` |
| Generate trip | Document in `trips` |
| Add expense | Document in `expenses` |
| Trains search | `live: false` until a real provider is plugged |

Gemini live itineraries: `GEMINI_API_KEY` backend `.env` mein daalo. Key frontend pe kabhi nahi jaati.

## Folder copy order

1. `client/` — React UI  
2. `server/` — Express API  
3. `docker-compose.yml` + `MONGODB_URI` — live database  

Poori tree: [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md)
