import app from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';
import { connectDB } from './config/db.js';
import { seedStore } from './store/index.js';

async function main() {
  const db = await connectDB();
  await seedStore();

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.success(`YatraGenie AI API listening on http://0.0.0.0:${env.PORT}`);
    logger.info(`Storage: ${db.mode === 'mongo' ? 'MongoDB' : 'in-memory (demo mode)'}`);
    logger.info('Demo account → demo@yatragenie.ai / Demo@1234');
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 8000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error('Fatal startup error:', err);
  process.exit(1);
});
