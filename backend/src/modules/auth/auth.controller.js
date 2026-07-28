import { env } from '../../config/env.js';

const cookieOptions = (expiresAt) => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  expires: expiresAt,
  path: '/api/v1/auth'
});
const clearCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  path: '/api/v1/auth'
};
const metadata = (req) => ({
  ipAddress: req.ip,
  userAgent: req.get('user-agent'),
  requestId: req.get('x-request-id')
});

export class AuthController {
  constructor(service) {
    this.service = service;
  }

  register = async (req, res) =>
    res.status(201).json({ data: await this.service.register(req.body) });
  login = async (req, res) => {
    const session = await this.service.login({ ...req.body, metadata: metadata(req) });
    res.cookie('refresh_token', session.refreshToken, cookieOptions(session.refreshExpiresAt));
    res.status(200).json({ data: { accessToken: session.accessToken, user: session.user } });
  };
  refresh = async (req, res) => {
    const session = await this.service.refresh(req.cookies.refresh_token, metadata(req));
    res.cookie('refresh_token', session.refreshToken, cookieOptions(session.refreshExpiresAt));
    res.status(200).json({ data: { accessToken: session.accessToken, user: session.user } });
  };
  logout = async (req, res) => {
    await this.service.logout(req.cookies.refresh_token);
    res.clearCookie('refresh_token', clearCookieOptions).status(204).send();
  };
  forgotPassword = async (req, res) => {
    await this.service.requestPasswordReset(req.body.email);
    res
      .status(202)
      .json({ data: { message: 'If the account exists, reset instructions have been sent.' } });
  };
  resetPassword = async (req, res) => {
    await this.service.resetPassword(req.body.token, req.body.password);
    res.status(204).send();
  };
  changePassword = async (req, res) => {
    await this.service.changePassword(req.auth.sub, req.body.currentPassword, req.body.password);
    res.status(204).send();
  };
  verifyEmail = async (req, res) => {
    await this.service.verifyEmail(req.body.token);
    res.status(204).send();
  };
}
