# Development

Use Node.js 22 and npm 10+. Start by copying the example environment files and filling in the required secrets:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The backend requires MongoDB. A local database can be started with:

```bash
docker compose -f docker/docker-compose.yml up -d mongo
```

Install dependencies and start both services:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run lint
npm test
npm run build
npm run seed -w backend
```

The API is available at `http://localhost:3000/api/v1` and the frontend at `http://localhost:5173`.
