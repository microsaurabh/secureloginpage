import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { validateEnvironment } from '../config/env.js';
import { Role } from '../modules/roles/role.model.js';
import { seedDefaultRoles } from './default-roles.service.js';
import { logger } from '../utils/logger.js';

validateEnvironment();

try {
  await connectDatabase();
  const count = await seedDefaultRoles(Role);
  logger.info('Default role seeding completed', { count });
} finally {
  await disconnectDatabase();
}
