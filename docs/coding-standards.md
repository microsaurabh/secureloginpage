# Coding Standards

- Use ES modules and Node.js 22 language features.
- Organize backend code by feature. Keep HTTP concerns in controllers, business rules in services, and persistence access in repositories.
- Validate all external input before it reaches a service.
- Return errors through the centralized error handler; do not expose stack traces.
- Use the shared Winston logger for operational events.
- Keep authentication and authorization logic centralized in middleware and services.
- Add or update tests whenever behavior changes, and keep documentation aligned with the shipped implementation.
- Run `npm run format`, `npm run lint`, `npm test`, and `npm run build` before submitting changes.
