# API Documentation

Interactive OpenAPI documentation is exposed by the backend at `/api-docs`.

## Versioning

All application endpoints are served beneath `/api/v1`. A future breaking API revision will use a new URL version without changing the existing contract.

## Health

`GET /api/v1/health` returns a 200 response containing the service name, status, and ISO-8601 timestamp. It requires no authentication because it is intended for load balancers and orchestrators.

Error responses use the envelope `{ "error": { "message": "...", "details": [] } }`.

## Authentication

`/api/v1/auth` provides registration, login, logout, refresh, password reset, password change, and email verification. Login and refresh return a short-lived JWT access token in the response and rotate an opaque refresh token stored only in an HttpOnly cookie. Use `Authorization: Bearer <access-token>` for protected endpoints.

Refresh-token reuse revokes the entire token family. Password changes and resets revoke every active refresh token for the account.
