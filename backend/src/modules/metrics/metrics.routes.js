import { Router } from 'express';
import { requireAuthentication, requireRoles } from '../../middlewares/authentication.js';
import { metricsService } from './metrics.service.js';

export const metricsRouter = Router();
metricsRouter.get('/', requireAuthentication, requireRoles('ADMIN', 'SUPER_ADMIN'), (_req, res) => {
  res.status(200).json({ data: metricsService.snapshot() });
});
