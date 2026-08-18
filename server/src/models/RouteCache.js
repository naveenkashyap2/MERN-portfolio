const mongoose = require('mongoose');

const routeCacheSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mode: { type: String, required: true },
    origin: { lat: Number, lng: Number, name: String },
    destination: { lat: Number, lng: Number, name: String },
    distanceKm: Number,
    durationMinutes: Number,
    trust: { type: String, default: 'ESTIMATED' },
    provider: { type: String, default: 'geometric' },
    geometry: { type: Array, default: [] },
    comparison: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('RouteCache', routeCacheSchema);
