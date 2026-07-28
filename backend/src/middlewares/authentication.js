import { ApiError } from '../utils/api-error.js';
import { verifyAccessToken } from '../utils/jwt.js';

export function requireAuthentication(req, _res, next) {
  if (req.auth) {
    return next();
  }

  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token)
    return next(
      new ApiError(401, 'Authentication is required', undefined, 'AUTHENTICATION_REQUIRED')
    );
  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    next(
      new ApiError(401, 'Access token is invalid or expired', undefined, 'INVALID_ACCESS_TOKEN')
    );
  }
}

export const requireRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!req.auth?.roles?.some((role) => roles.includes(role)))
      return next(new ApiError(403, 'Insufficient permissions', undefined, 'AUTHORIZATION_DENIED'));
    next();
  };
