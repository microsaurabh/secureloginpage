import { body, query } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request.js';

export const listUsersValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().isString().trim().escape(),
  query('status').optional().isIn(['active', 'inactive', 'locked']).withMessage('Invalid status'),
  query('sortBy').optional().isIn(['createdAt', 'email', 'firstName', 'lastName', 'status']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
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
