import { healthService } from './health.service.js';

export function getHealth(_req, res) {
  res.status(200).json({ data: healthService.getStatus() });
}
