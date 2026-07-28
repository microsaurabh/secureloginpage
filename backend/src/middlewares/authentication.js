import { ApiError } from '../utils/api-error.js';
import { verifyAccessToken } from '../utils/jwt.js';

export function authenticate(req, _res, next) {
  if (req.auth) {
    req.user = req.auth;
    return next();
  }

  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token)
    return next(
      new ApiError(401, 'Authentication is required', undefined, 'AUTHENTICATION_REQUIRED')
    );
  try {
    req.auth = verifyAccessToken(token);
    req.user = req.auth;
    next();
  } catch {
    next(
      new ApiError(401, 'Access token is invalid or expired', undefined, 'INVALID_ACCESS_TOKEN')
    );
  }
}

export const requireAuthentication = authenticate;

export const requireRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!req.auth?.roles?.some((role) => roles.includes(role)))
      return next(new ApiError(403, 'Insufficient permissions', undefined, 'AUTHORIZATION_DENIED'));
    next();
  };

export const authorize = (requiredPermissions = []) => (req, _res, next) => {
  if (!req.auth) {
    return next(new ApiError(401, 'Authentication is required', undefined, 'AUTHENTICATION_REQUIRED'));
  }

  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  const hasAdminRole = req.auth.roles?.some((role) => ['ADMIN', 'SUPER_ADMIN'].includes(role));
  const userPermissions = req.auth.permissions ?? [];
  const hasPermissions = permissions.every(
    (permission) => hasAdminRole || userPermissions.includes(permission)
  );

  if (!hasPermissions) {
    return next(new ApiError(403, 'Insufficient permissions', undefined, 'AUTHORIZATION_DENIED'));
  }

  next();
};
