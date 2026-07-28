# Secure Login Portal

Secure Login Portal is a production-oriented authentication platform built with a modular Express backend and a React/Vite frontend. The current sprint delivers a secure foundation for registration, login, session refresh, logout, password reset, email verification, and role-based access control.

## What is included

- Versioned REST API at `/api/v1`
- JWT access tokens with rotating refresh tokens stored in HttpOnly cookies
- Centralized validation, logging, and error handling
- Repository-service-controller architecture for feature modules
- OpenAPI documentation at `/api-docs`
- RBAC-ready middleware and audit/login-history support

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Configure environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start MongoDB and the application:

```bash
docker compose -f docker/docker-compose.yml up -d mongo
npm run dev
```

- Frontend: http://localhost:5173
- API health check: http://localhost:3000/api/v1/health
- OpenAPI UI: http://localhost:3000/api-docs

## Database seed

After setting `backend/.env` and starting MongoDB, seed the default roles:

```bash
npm run seed -w backend
```

## Authentication configuration

SMTP credentials in `backend/.env` are required for account verification and password-reset emails. Configure the `SMTP_*` and `EMAIL_FROM` values from [backend/.env.example](backend/.env.example) before exercising those flows.

## Quality checks

```bash
npm run format:check
npm run lint
npm test
npm run build
```

## Documentation

See [architecture](docs/architecture.md), [development](docs/development.md), [database design](docs/database.md), [API](docs/api.md), [coding standards](docs/coding-standards.md), and [folder structure](docs/folder-structure.md).
