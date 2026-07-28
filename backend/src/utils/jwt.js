import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (user) =>
  jwt.sign(
    { sub: user.id ?? user._id.toString(), roles: user.roles.map((role) => role.name ?? role) },
    env.jwtAccessSecret,
    {
      expiresIn: env.jwtAccessTtl,
      issuer: 'secure-login-portal',
      audience: 'secure-login-portal-web'
    }
  );

export const verifyAccessToken = (token) =>
  jwt.verify(token, env.jwtAccessSecret, {
    issuer: 'secure-login-portal',
    audience: 'secure-login-portal-web'
  });
