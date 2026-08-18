import mongoose from 'mongoose';

const locationPointSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', index: true },
    sessionId: { type: String, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

// Retention-friendly index — allows pruning old points efficiently.
locationPointSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const locationSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', index: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
    destination: {
      name: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    destinationRadius: { type: Number, default: 100 },
    distanceTravelled: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const LocationPoint = mongoose.model('LocationPoint', locationPointSchema);
export const LocationSession = mongoose.model('LocationSession', locationSessionSchema);
