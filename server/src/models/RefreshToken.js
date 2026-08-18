const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    familyId: { type: String, required: true, index: true },
    userAgent: { type: String, default: '', maxlength: 300 },
    ip: { type: String, default: '', maxlength: 80 },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    replacedByHash: { type: String, default: '' },
    reuseDetected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ userId: 1, revokedAt: 1 });

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('RefreshToken', refreshTokenSchema, { unique: ['tokenHash'] });
