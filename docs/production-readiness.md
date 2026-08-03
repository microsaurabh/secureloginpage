# Production Readiness Checklist

- [x] Versioned API, validation, centralized errors, security headers, rate limits, compression, request IDs, and JSON logging.
- [x] JWT access tokens, refresh-token rotation, password hashing, account lockouts, RBAC, and CSRF protection for cookie sessions.
- [x] Liveness/readiness checks, protected application metrics, graceful shutdown, Docker health checks, and Mongo pool limits.
- [x] Docker Compose, Nginx proxy configuration, CI quality gate, backup/restore/deploy scripts, and operational documentation.
- [ ] Put secrets in a managed secret store and rotate the JWT/SMTP credentials before go-live.
- [ ] Terminate TLS at the edge and set the actual public client origin.
- [ ] Configure external uptime, error, log-retention, database, and backup-success alerts.
- [ ] Perform a production-like load test and a penetration test before public launch.
