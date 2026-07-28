import { body, query } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request.js';

export const listPermissionsValidator = [
  query('search').optional().isString().trim().escape(),
  validateRequest
];

export const upsertPermissionValidator = [
  body('resource').isString().trim().isLength({ min: 2, max: 100 }),
  body('action').isIn(['create', 'read', 'update', 'delete', 'manage']),
  body('description').optional().isString().trim().isLength({ min: 1, max: 500 }),
  validateRequest
];
