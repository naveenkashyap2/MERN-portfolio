const mongoose = require('mongoose');

const locationPointSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    sessionId: { type: String, required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

locationPointSchema.index({ sessionId: 1, timestamp: 1 });
locationPointSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 14 });

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('LocationPoint', locationPointSchema);
