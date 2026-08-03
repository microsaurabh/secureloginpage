import { Router } from 'express';
import { getHealth, getReadiness } from './health.controller.js';

export const healthRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Return API service health
 *     responses:
 *       200:
 *         description: API is available
 */
healthRouter.get('/', getHealth);
healthRouter.get('/ready', getReadiness);
