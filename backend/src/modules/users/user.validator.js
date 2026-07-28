import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request.js';

export const listUsersValidator = [
  body('page').optional().isInt({ min: 1 }).toInt(),
  body('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  body('search').optional().isString().trim().escape(),
  body('status').optional().isIn(['active', 'inactive', 'locked']).withMessage('Invalid status'),
  validateRequest
];

export const updateUserStatusValidator = [
  body('status').isIn(['active', 'inactive', 'locked']).withMessage('Invalid status'),
  validateRequest
];

export const updateProfileValidator = [
  body('firstName').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('lastName').optional().isString().trim().isLength({ min: 1, max: 100 }),
  validateRequest
];
