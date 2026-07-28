import { Router } from 'express';
import { requireAuthentication, requireRoles } from '../../middlewares/authentication.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { listUsersValidator, updateProfileValidator, updateUserStatusValidator } from './user.validator.js';

export function createUserRouter(service = new UserService()) {
  const router = Router();
  const controller = new UserController(service);

  router.get('/me', requireAuthentication, controller.getProfile);
  router.put('/me', requireAuthentication, updateProfileValidator, controller.updateProfile);
  router.get('/', requireAuthentication, requireRoles('ADMIN', 'SUPER_ADMIN'), listUsersValidator, controller.listUsers);
  router.patch('/:userId/status', requireAuthentication, requireRoles('ADMIN', 'SUPER_ADMIN'), updateUserStatusValidator, controller.setStatus);
  router.post('/:userId/reset-password', requireAuthentication, requireRoles('ADMIN', 'SUPER_ADMIN'), controller.resetPassword);
  router.post('/:userId/roles', requireAuthentication, requireRoles('ADMIN', 'SUPER_ADMIN'), controller.assignRoles);
  router.delete('/:userId', requireAuthentication, requireRoles('ADMIN', 'SUPER_ADMIN'), controller.deleteUser);
  router.get('/:userId/login-history', requireAuthentication, requireRoles('ADMIN', 'SUPER_ADMIN'), controller.getLoginHistory);
  router.get('/:userId/audit-logs', requireAuthentication, requireRoles('ADMIN', 'SUPER_ADMIN'), controller.getAuditLogs);

  return router;
}
