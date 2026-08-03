import 'dotenv/config';

const required = ['MONGODB_URI'];

export function validateEnvironment() {
  if (process.env.NODE_ENV === 'test') return;
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length)
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGODB_URI,
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'development-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'development-refresh-secret',
  jwtAccessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 7),
  rememberMeTtlDays: Number(process.env.REMEMBER_ME_TTL_DAYS ?? 30),
  accountLockMaxAttempts: Number(process.env.ACCOUNT_LOCK_MAX_ATTEMPTS ?? 5),
  accountLockMinutes: Number(process.env.ACCOUNT_LOCK_MINUTES ?? 15),
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  emailFrom: process.env.EMAIL_FROM,
  emailTransport: process.env.EMAIL_TRANSPORT ?? 'smtp',
  mongoMaxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE ?? 20),
  mongoMinPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE ?? 2),
  shutdownTimeoutMs: Number(process.env.SHUTDOWN_TIMEOUT_MS ?? 10000)
};
