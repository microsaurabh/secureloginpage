import express from 'express';
import { authenticate, authorize } from '../../middlewares/authentication.js';
import {
  assignPermissions,
  listRoles,
  getRole,
  upsertRole,
  deleteRole
} from './role.controller.js';
import {
  listRolesValidator,
  getRoleValidator,
  upsertRoleValidator,
  deleteRoleValidator,
  assignPermissionsValidator
} from './role.validator.js';
import { invalidateResponseCache, responseCache } from '../../middlewares/response-cache.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize(['manage:roles']), responseCache(30_000), listRolesValidator, listRoles);
router.get('/:id', authorize(['manage:roles']), responseCache(30_000), getRoleValidator, getRole);
router.post(
  '/',
  authorize(['manage:roles']),
  invalidateResponseCache,
  upsertRoleValidator,
  upsertRole
);
router.post(
  '/:id/permissions',
  authorize(['manage:roles']),
  invalidateResponseCache,
  assignPermissionsValidator,
  assignPermissions
);
router.delete(
  '/:id',
  authorize(['manage:roles']),
  invalidateResponseCache,
  deleteRoleValidator,
  deleteRole
);

export default router;
