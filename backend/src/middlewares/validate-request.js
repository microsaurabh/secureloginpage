import { validationResult } from 'express-validator';
import { ApiError } from '../utils/api-error.js';

export function validateRequest(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(new ApiError(422, 'Request validation failed', errors.array()));
  next();
}
