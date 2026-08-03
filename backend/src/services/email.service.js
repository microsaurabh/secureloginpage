import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../utils/logger.js';

export class EmailService {
  constructor(transport = null) {
    this.transport = transport;
  }

  getTransport() {
    if (this.transport) return this.transport;
    if (env.emailTransport === 'console') {
      if (env.nodeEnv === 'production') {
        throw new ApiError(
          503,
          'Console email transport cannot be used in production',
          undefined,
          'EMAIL_NOT_CONFIGURED'
        );
      }
      this.transport = nodemailer.createTransport({ jsonTransport: true });
      return this.transport;
    }
    if (!env.smtpHost || !env.smtpUser || !env.smtpPassword || !env.emailFrom) {
      throw new ApiError(
        503,
        'Email delivery is not configured',
        undefined,
        'EMAIL_NOT_CONFIGURED'
      );
    }
    this.transport = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPassword }
    });
    return this.transport;
  }

  async sendVerificationEmail({ to, token }) {
    const result = await this.getTransport().sendMail({
      from: env.emailFrom,
      to,
      subject: 'Verify your Secure Login Portal email',
      text: `Use this verification token: ${token}`
    });
    this.logDevelopmentMessage(result, 'verification');
    return result;
  }

  async sendPasswordResetEmail({ to, token }) {
    const result = await this.getTransport().sendMail({
      from: env.emailFrom,
      to,
      subject: 'Reset your Secure Login Portal password',
      text: `Use this password reset token: ${token}`
    });
    this.logDevelopmentMessage(result, 'password reset');
    return result;
  }

  logDevelopmentMessage(result, type) {
    if (env.emailTransport === 'console') {
      logger.info(`Development ${type} email generated`, { message: result.message });
    }
  }
}
