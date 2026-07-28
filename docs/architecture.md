# Architecture

The repository uses npm workspaces: `backend` for the Express API and `frontend` for the React client.

The API is mounted at `/api/v1`. Each backend domain module owns its routes, controller, service, repository, validator, Mongoose model, and tests where applicable. Controllers handle HTTP concerns, services hold business rules, and repositories isolate persistence.

The persistence layer is implemented as feature modules. Models own document constraints and indexes; repositories expose persistence operations and accept their Mongoose model through constructor injection. Authentication routes are introduced in the next sprint.
