import { ApiError } from '../utils/api-error.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  logger.error(error.message, { stack: error.stack });
  const status = error.statusCode ?? 500;
  res.status(status).json({
    error: {
      message: status === 500 ? 'Internal server error' : error.message,
      details: error.details
    }
  });
}
