import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env, validateEnvironment } from './config/env.js';
import { logger } from './utils/logger.js';

validateEnvironment();
const app = createApp();
const server = await connectDatabase().then(() =>
  app.listen(env.port, () => logger.info(`API listening on port ${env.port}`))
);

async function shutdown(signal) {
  logger.info(`${signal} received; shutting down`);
  const forcedExit = setTimeout(() => {
    logger.error('Graceful shutdown timed out; forcing exit');
    process.exit(1);
  }, env.shutdownTimeoutMs);
  forcedExit.unref();
  server.close(async () => {
    await disconnectDatabase();
    clearTimeout(forcedExit);
    process.exit(0);
  });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
