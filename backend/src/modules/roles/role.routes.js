import express from 'express';
import { authenticate, authorize } from '../../middlewares/authentication.js';
import { assignPermissions, listRoles, getRole, upsertRole, deleteRole } from './role.controller.js';
import { listRolesValidator, getRoleValidator, upsertRoleValidator, deleteRoleValidator, assignPermissionsValidator } from './role.validator.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize(['manage:roles']), listRolesValidator, listRoles);
router.get('/:id', authorize(['manage:roles']), getRoleValidator, getRole);
router.post('/', authorize(['manage:roles']), upsertRoleValidator, upsertRole);
router.post('/:id/permissions', authorize(['manage:roles']), assignPermissionsValidator, assignPermissions);
router.delete('/:id', authorize(['manage:roles']), deleteRoleValidator, deleteRole);

export default router;
