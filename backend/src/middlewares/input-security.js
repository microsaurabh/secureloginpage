import { randomUUID, timingSafeEqual } from 'node:crypto';
import { ApiError } from '../utils/api-error.js';

function inspect(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith('$') || key.includes('.')) {
      throw new ApiError(400, 'Invalid request field', undefined, 'INVALID_REQUEST_FIELD');
    }
    inspect(child);
  }
}

export function rejectMongoOperators(req, _res, next) {
  try {
    inspect(req.body);
    inspect(req.query);
    inspect(req.params);
    next();
  } catch (error) {
    next(error);
  }
}

export function issueCsrfToken(_req, res) {
  const token = randomUUID();
  res.cookie('csrf_token', token, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/v1'
  });
  res.status(200).json({ data: { csrfToken: token } });
}

export function requireCsrfForCookieSession(req, _res, next) {
  if (!req.cookies?.refresh_token) return next();
  const cookieToken = req.cookies.csrf_token;
  const headerToken = req.get('x-csrf-token');
  if (!cookieToken || !headerToken) {
    return next(new ApiError(403, 'CSRF token is required', undefined, 'CSRF_TOKEN_REQUIRED'));
  }
  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);
  if (cookieBuffer.length !== headerBuffer.length || !timingSafeEqual(cookieBuffer, headerBuffer)) {
    return next(new ApiError(403, 'CSRF token is invalid', undefined, 'CSRF_TOKEN_INVALID'));
  }
  next();
}
