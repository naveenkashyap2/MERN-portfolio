const mongoose = require('mongoose');

const locationSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null, index: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    status: { type: String, enum: ['active', 'stopped', 'completed'], default: 'active' },
    destination: {
      name: { type: String, default: '' },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    destinationRadius: { type: Number, default: 100, enum: [50, 100, 250] },
    distanceTravelled: { type: Number, default: 0 },
    lastLat: { type: Number, default: null },
    lastLng: { type: Number, default: null },
    arrivalConfirms: { type: Number, default: 0 },
    arrivedAt: { type: Date, default: null },
    consentAt: { type: Date, required: true },
  },
  { timestamps: true }
);

locationSessionSchema.index({ userId: 1, status: 1 });

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('LocationSession', locationSessionSchema);
