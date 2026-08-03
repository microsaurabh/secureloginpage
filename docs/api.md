# API Documentation

Interactive OpenAPI documentation is exposed by the backend at `/api-docs`.

## Versioning

All application endpoints are served beneath `/api/v1`. A future breaking API revision will use a new URL version without changing the existing contract.

## Response format

Successful responses use a consistent envelope:

```json
{
  "data": { "...": "..." }
}
```

Error responses use:

```json
{
  "error": {
    "message": "...",
    "details": []
  }
}
```

## Health

`GET /api/v1/health` returns a 200 response containing the service name, status, and ISO-8601 timestamp. It requires no authentication because it is intended for load balancers and orchestrators.

`GET /api/v1/health/ready` verifies that MongoDB is connected and returns 503 while the application is not ready to serve traffic. `GET /api/v1/csrf-token` issues the double-submit token used by cookie-session endpoints. `GET /api/v1/metrics` requires an administrator access token.

## Authentication

`POST /api/v1/auth/register` creates an account and sends an email verification message.

`POST /api/v1/auth/login` authenticates a user and returns a short-lived JWT access token. The refresh token is rotated and stored as a secure HttpOnly cookie.

`POST /api/v1/auth/refresh` rotates the current refresh token and issues a new access token.

`POST /api/v1/auth/logout` invalidates the current refresh token.

`POST /api/v1/auth/forgot-password` requests a reset flow for a known email address.

`POST /api/v1/auth/reset-password` completes a password reset using a one-time token.

`POST /api/v1/auth/change-password` changes the authenticated user password. Use `Authorization: Bearer <access-token>` for this endpoint.

`POST /api/v1/auth/verify-email` verifies a user email address using a one-time token.

Refresh-token reuse revokes the entire token family. Password changes and resets revoke every active refresh token for the account.
