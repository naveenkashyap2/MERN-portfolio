const LocationPoint = require('../models/LocationPoint');
const { env } = require('../config/env');
const { logger } = require('../config/logger');

async function purgeOldLocationPoints() {
  const cutoff = new Date(Date.now() - env.locationRetentionDays * 24 * 60 * 60 * 1000);
  const result = await LocationPoint.deleteMany({ timestamp: { $lt: cutoff } });
  if (result.deletedCount) {
    logger.info('location_retention', { deleted: result.deletedCount });
  }
}

function startRetentionJob() {
  const day = 24 * 60 * 60 * 1000;
  setInterval(() => {
    purgeOldLocationPoints().catch(() => {});
  }, day);
}

module.exports = { startRetentionJob, purgeOldLocationPoints };
