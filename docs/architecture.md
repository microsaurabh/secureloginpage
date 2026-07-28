# Architecture

The repository uses npm workspaces: `backend` for the Express API and `frontend` for the React client.

The API is mounted at `/api/v1`. Each backend domain module owns its routes, controller, service, repository, validator, Mongoose model, and tests where applicable. Controllers handle HTTP concerns, services hold business rules, and repositories isolate persistence.

Authentication routes and persistence domains are introduced in subsequent sprints. The foundation includes only the system health endpoint and cross-cutting concerns.
