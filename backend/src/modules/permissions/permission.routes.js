import express from 'express';
import { authenticate, authorize } from '../../middlewares/authentication.js';
import { listPermissionsValidator, upsertPermissionValidator } from './permission.validator.js';
import { listPermissions, upsertPermission, deletePermission } from './permission.controller.js';
import { invalidateResponseCache, responseCache } from '../../middlewares/response-cache.js';

const router = express.Router();

router.use(authenticate);
router.get(
  '/',
  authorize(['manage:permissions']),
  responseCache(30_000),
  listPermissionsValidator,
  listPermissions
);
router.post(
  '/',
  authorize(['manage:permissions']),
  invalidateResponseCache,
  upsertPermissionValidator,
  upsertPermission
);
router.delete('/:id', authorize(['manage:permissions']), invalidateResponseCache, deletePermission);

export default router;
