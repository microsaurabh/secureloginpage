import { randomUUID } from 'node:crypto';
import { metricsService } from '../modules/metrics/metrics.service.js';
import { logger } from '../utils/logger.js';

export function requestContext(req, res, next) {
  const requestId = req.get('x-request-id') || randomUUID();
  const startedAt = process.hrtime.bigint();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    metricsService.recordResponse(res.statusCode);
    logger.http('request completed', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      ip: req.ip
    });
  });
  next();
}
