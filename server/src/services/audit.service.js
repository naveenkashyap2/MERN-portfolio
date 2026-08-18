const AuditLog = require('../models/AuditLog');
const { logger } = require('../config/logger');

async function audit(action, req, meta = {}) {
  try {
    await AuditLog.create({
      userId: req.user?._id || null,
      action,
      requestId: req.requestId,
      ip: req.ip,
      userAgent: String(req.get('user-agent') || '').slice(0, 300),
      meta,
    });
    logger.audit(action, { requestId: req.requestId, userId: req.user?._id ? String(req.user._id) : null });
  } catch (err) {
    logger.warn('audit_failed', { action, requestId: req.requestId });
  }
}

module.exports = { audit };
