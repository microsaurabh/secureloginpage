# Deployment Guide

## Prerequisites

Use Docker Engine with Compose v2, MongoDB credentials, SMTP credentials, and long random JWT secrets. Copy `backend/.env.example` to `backend/.env`; never commit that file.

Set `NODE_ENV=production`, `CLIENT_ORIGIN` to the public UI origin, and use a managed MongoDB deployment with TLS, restricted network access, backups, and a least-privilege database user.

## Container deployment

Run `docker compose -f docker/docker-compose.yml up --build` for a fully containerized local stack. It starts MongoDB, the API, Nginx-served web app, Mailpit (the local email inbox), and a one-off RBAC seed job. The web service is exposed on port 8080 and proxies `/api/` to the API service; Mailpit is available on port 8025.

Run `npm run deploy` to build and start the production stack; the script applies `docker-compose.production.yml`, which removes the MongoDB host port and enables restart policies. Production requires `CLIENT_ORIGIN`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` in the deployment environment. Place TLS termination in front of Nginx, enforce HTTPS there, and forward `X-Forwarded-Proto`.

Verify `GET /api/v1/health` for liveness and `GET /api/v1/health/ready` for database readiness. The API container has a Docker health check; Compose waits for MongoDB and the API before starting dependants.

## Operations

Create a compressed database archive with `npm run backup -- -MongoUri '<uri>'`. Restore only into an approved target with `npm run restore -- -MongoUri '<uri>' -ArchivePath '<archive>'`; restoration drops the target database before loading the archive.

The included PM2 ecosystem file supports a non-container Node deployment. Run it under a process manager only after supplying production environment variables. Roll back by redeploying the last known-good image and restoring a backup only when data recovery is required.
