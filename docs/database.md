# Database Design

MongoDB is the system of record. Mongoose models use timestamps and omit the internal version key.

| Collection       | Purpose                         | Key constraints                                                   |
| ---------------- | ------------------------------- | ----------------------------------------------------------------- |
| `users`          | Identity and account state      | Case-normalized email, unique among active records, soft deletion |
| `roles`          | RBAC role definitions           | Unique active role name, soft deletion                            |
| `permissions`    | Resource/action capabilities    | Unique active resource/action pair, soft deletion                 |
| `refreshTokens`  | Rotatable session tokens        | Hash only, unique hash, TTL expiry, family index                  |
| `passwordResets` | One-time password reset proofs  | Hash only, unique hash, TTL expiry                                |
| `auditLogs`      | Immutable security audit events | Actor/action and chronological indexes                            |
| `loginHistories` | Login attempts                  | User and chronological indexes                                    |

Run `npm run seed -w backend` after configuring `backend/.env` to ensure the `SUPER_ADMIN`, `ADMIN`, `AUDITOR`, and `USER` system roles exist. The command is idempotent.
