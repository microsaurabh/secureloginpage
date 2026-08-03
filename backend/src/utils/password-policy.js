import { ApiError } from './api-error.js';

export function assertPasswordPolicy(password) {
  const failures = [];
  if (typeof password !== 'string' || password.length < 8) failures.push('at least 8 characters');
  if (!/[a-z]/.test(password)) failures.push('a lowercase letter');
  if (!/[A-Z]/.test(password)) failures.push('an uppercase letter');
  if (!/\d/.test(password)) failures.push('a number');
  if (!/[^A-Za-z0-9]/.test(password)) failures.push('a special character');
  if (failures.length)
    throw new ApiError(
      422,
      `Password must include ${failures.join(', ')}`,
      undefined,
      'PASSWORD_POLICY_VIOLATION'
    );
}
