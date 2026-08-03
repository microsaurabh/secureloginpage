# Release Notes — 1.0.0

This release completes the Secure Login Portal baseline: authentication with refresh-token rotation, profile and user administration, RBAC, and a responsive React administration interface.

Production hardening adds secure HTTP headers, constrained request bodies, NoSQL-operator rejection, CSRF protection for cookie sessions, request IDs, JSON logs, request-duration logging, readiness and metrics endpoints, Mongo connection-pool limits, and short-lived role/permission response caching.

Deployment assets now include hardened Nginx configuration, health-aware Docker Compose, image health checks, PM2 configuration, backup/restore scripts, and an operational deployment guide.
