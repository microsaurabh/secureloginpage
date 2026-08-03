import { healthService } from './health.service.js';

export function getHealth(_req, res) {
  res.status(200).json({ data: healthService.getStatus() });
}

export function getReadiness(_req, res) {
  const readiness = healthService.getReadiness();
  res.status(readiness.status === 'ready' ? 200 : 503).json({ data: readiness });
}
