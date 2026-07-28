# Secure Login Portal

Enterprise authentication platform foundation. Authentication flows are deliberately not implemented yet.

## Quick start

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API health check: http://localhost:3000/api/v1/health
- OpenAPI UI: http://localhost:3000/api-docs

## Quality checks

```bash
npm run format:check
npm run lint
npm test
npm run build
```

## Database seed

After setting `backend/.env` and starting MongoDB, seed the default system roles:

```bash
npm run seed -w backend
```

## Authentication configuration

Sprint 3 requires SMTP credentials in `backend/.env` for account verification and password-reset emails. Configure the `SMTP_*` and `EMAIL_FROM` values from [`.env.example`](backend/.env.example) before using those flows.

## Documentation

See [architecture](docs/architecture.md), [development](docs/development.md), [database design](docs/database.md), [API](docs/api.md), [coding standards](docs/coding-standards.md), and [folder structure](docs/folder-structure.md).
