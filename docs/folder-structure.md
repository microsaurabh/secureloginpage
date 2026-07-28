# Folder Structure

```
backend/src/
  config/        runtime configuration, database, OpenAPI
  middlewares/   cross-cutting Express middleware
  modules/       feature modules (controller, routes, service, repository, validator, model, tests)
  routes/        API version composition
  seeds/         deterministic, idempotent reference-data seeding
  utils/         shared errors and logging
frontend/src/
  api/           HTTP client
  pages/         route-level UI
docker/          container and Compose definitions
docs/            architecture, API, development, and engineering guides
```
