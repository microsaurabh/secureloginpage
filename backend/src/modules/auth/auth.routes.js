import { Router } from 'express';
import { requireAuthentication } from '../../middlewares/authentication.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { requireCsrfForCookieSession } from '../../middlewares/input-security.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import {
  changePasswordValidator,
  emailValidator,
  loginValidator,
  registerValidator,
  resetValidator,
  tokenValidator
} from './auth.validator.js';

export function createAuthRouter(service = new AuthService()) {
  const router = Router();
  const controller = new AuthController(service);
  router.post('/register', registerValidator, asyncHandler(controller.register));
  router.post('/login', loginValidator, asyncHandler(controller.login));
  router.post('/refresh', requireCsrfForCookieSession, asyncHandler(controller.refresh));
  router.post('/logout', requireCsrfForCookieSession, asyncHandler(controller.logout));
  router.post('/forgot-password', emailValidator, asyncHandler(controller.forgotPassword));
  router.post('/reset-password', resetValidator, asyncHandler(controller.resetPassword));
  router.post(
    '/change-password',
    requireAuthentication,
    changePasswordValidator,
    asyncHandler(controller.changePassword)
  );
  router.post('/verify-email', tokenValidator, asyncHandler(controller.verifyEmail));
  return router;
}
