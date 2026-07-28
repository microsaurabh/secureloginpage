import { body, query, param } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request.js';

export const listRolesValidator = [
  query('search').optional().isString().trim().escape(),
  validateRequest
];

export const getRoleValidator = [param('id').isMongoId(), validateRequest];

export const upsertRoleValidator = [
  body('name').isString().trim().isLength({ min: 2, max: 50 }),
  body('description').isString().trim().isLength({ min: 1, max: 500 }),
  body('permissions').optional().isArray(),
  body('isSystem').optional().isBoolean(),
  validateRequest
];

export const deleteRoleValidator = [param('id').isMongoId(), validateRequest];

export const assignPermissionsValidator = [
  body('permissions').optional().isArray(),
  validateRequest
];
