import { Router } from 'express';
import { healthRouter } from '../modules/health/health.routes.js';
import { createAuthRouter } from '../modules/auth/auth.routes.js';
import permissionRoutes from '../modules/permissions/permission.routes.js';
import roleRoutes from '../modules/roles/role.routes.js';
import { createUserRouter } from '../modules/users/user.routes.js';
import { issueCsrfToken } from '../middlewares/input-security.js';
import { metricsRouter } from '../modules/metrics/metrics.routes.js';

export const apiRouter = Router();
apiRouter.use('/health', healthRouter);
apiRouter.get('/csrf-token', issueCsrfToken);
apiRouter.use('/metrics', metricsRouter);
apiRouter.use('/auth', createAuthRouter());
apiRouter.use('/users', createUserRouter());
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/permissions', permissionRoutes);
