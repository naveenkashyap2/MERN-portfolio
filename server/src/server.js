const { env } = require('./config/env');
const { logger } = require('./config/logger');
const { connectDb } = require('./config/db');
const { createApp } = require('./app');
const { startRetentionJob } = require('./jobs/retention');

async function start() {
  await connectDb();
  const app = createApp();
  startRetentionJob();
  app.listen(env.port, env.host, () => {
    logger.info(`YatraGenie API listening on ${env.host}:${env.port}`);
  });
}

start().catch((err) => {
  logger.error('fatal_startup', { message: err.message });
  process.exit(1);
});
