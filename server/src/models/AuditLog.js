const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    action: { type: String, required: true, maxlength: 80, index: true },
    requestId: { type: String, default: '' },
    ip: { type: String, default: '', maxlength: 80 },
    userAgent: { type: String, default: '', maxlength: 300 },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('AuditLog', auditLogSchema);
