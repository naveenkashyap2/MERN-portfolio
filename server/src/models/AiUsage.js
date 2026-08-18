const mongoose = require('mongoose');

const aiUsageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    requestId: { type: String, default: '' },
    action: { type: String, required: true },
    model: { type: String, default: '' },
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    latencyMs: { type: Number, default: 0 },
    success: { type: Boolean, default: false },
    failureReason: { type: String, default: '', maxlength: 200 },
  },
  { timestamps: true }
);

aiUsageSchema.index({ userId: 1, createdAt: -1 });

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('AiUsage', aiUsageSchema);
