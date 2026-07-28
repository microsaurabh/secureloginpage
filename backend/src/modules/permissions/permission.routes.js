import express from 'express';
import { authenticate, authorize } from '../../middlewares/authentication.js';
import { listPermissionsValidator, upsertPermissionValidator } from './permission.validator.js';
import { listPermissions, upsertPermission, deletePermission } from './permission.controller.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize(['manage:permissions']), listPermissionsValidator, listPermissions);
router.post('/', authorize(['manage:permissions']), upsertPermissionValidator, upsertPermission);
router.delete('/:id', authorize(['manage:permissions']), deletePermission);

export default router;
