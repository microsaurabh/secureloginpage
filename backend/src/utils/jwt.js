import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (user) => {
  const roles = (user.roles ?? [])
    .map((role) => (typeof role === 'string' ? role : role.name))
    .filter(Boolean);
  const permissions = [...new Set((user.roles ?? []).flatMap((role) => {
    if (typeof role === 'string' || role === null || role === undefined) return [];
    if (!Array.isArray(role.permissions)) return [];
    return role.permissions
      .filter(Boolean)
      .map((permission) =>
        typeof permission === 'string' ? permission : `${permission.resource}:${permission.action}`
      );
  }))];

  return jwt.sign(
    { sub: user.id ?? user._id.toString(), roles, permissions },
    env.jwtAccessSecret,
    {
      expiresIn: env.jwtAccessTtl,
      issuer: 'secure-login-portal',
      audience: 'secure-login-portal-web'
    }
  );
};

export const verifyAccessToken = (token) =>
  jwt.verify(token, env.jwtAccessSecret, {
    issuer: 'secure-login-portal',
    audience: 'secure-login-portal-web'
  });
