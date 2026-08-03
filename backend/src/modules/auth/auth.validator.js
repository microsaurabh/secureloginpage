import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request.js';

const password = body('password').isString().trim().isLength({ min: 8, max: 128 });
export const registerValidator = [
  body('firstName').trim().isLength({ min: 1, max: 100 }),
  body('lastName').trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  password,
  validateRequest
];
export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 1, max: 128 }),
  body('rememberMe').optional().isBoolean(),
  validateRequest
];
export const emailValidator = [body('email').isEmail().normalizeEmail(), validateRequest];
export const tokenValidator = [
  body('token').isString().isLength({ min: 32, max: 256 }),
  validateRequest
];
export const resetValidator = [...tokenValidator.slice(0, -1), password, validateRequest];
export const changePasswordValidator = [
  body('currentPassword').isString().isLength({ min: 1, max: 128 }),
  password,
  validateRequest
];
