# Developer Guide

## Local setup

Install Node 22, run `npm install`, copy both environment examples, start MongoDB, then run `npm run dev`. The API is available at `http://localhost:3000/api/v1` and the client at `http://localhost:5173`.

## Architecture rules

Backend features own their model, repository, service, controller, routes, validation, and tests. Keep HTTP concerns in controllers, data access in repositories, and business rules in services. Use `ApiError` for expected failures and let centralized error handling format responses.

Use access tokens in the `Authorization` header. Refresh tokens remain HttpOnly cookies and are protected with a double-submit CSRF token. The Axios client requests that token automatically for state-changing calls.

For local testing, set `EMAIL_TRANSPORT=console` to avoid sending real email. The generated verification and reset message is written to the API log. Production must use the SMTP transport and real credentials.

## Quality gate

Before submitting a change, run `npm run format:check`, `npm run lint`, `npm test`, and `npm run build`. Add focused tests for new validation, service behavior, and routes.
