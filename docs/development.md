# Development

Copy `backend/.env.example` to `backend/.env` and set secure secrets. Copy `frontend/.env.example` to `frontend/.env` if the API base URL differs.

Use Node.js 22, then run `npm install` and `npm run dev`. The backend requires MongoDB; `docker compose -f docker/docker-compose.yml up mongo` starts a local instance.
