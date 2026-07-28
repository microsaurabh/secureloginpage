# API Documentation

Interactive OpenAPI documentation is exposed by the backend at `/api-docs`.

## Versioning

All application endpoints are served beneath `/api/v1`. A future breaking API revision will use a new URL version without changing the existing contract.

## Health

`GET /api/v1/health` returns a 200 response containing the service name, status, and ISO-8601 timestamp. It requires no authentication because it is intended for load balancers and orchestrators.

Error responses use the envelope `{ "error": { "message": "...", "details": [] } }`.
