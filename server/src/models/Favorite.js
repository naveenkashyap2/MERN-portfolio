import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['place', 'hotel', 'trip'], required: true },
    refId: { type: String, required: true },
    snapshot: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, type: 1, refId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
