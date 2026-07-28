import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

export class EmailService {
  constructor(transport = null) {
    this.transport = transport;
  }

  getTransport() {
    if (this.transport) return this.transport;
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
    return this.getTransport().sendMail({
      from: env.emailFrom,
      to,
      subject: 'Verify your Secure Login Portal email',
      text: `Use this verification token: ${token}`
    });
  }

  async sendPasswordResetEmail({ to, token }) {
    return this.getTransport().sendMail({
      from: env.emailFrom,
      to,
      subject: 'Reset your Secure Login Portal password',
      text: `Use this password reset token: ${token}`
    });
  }
}
