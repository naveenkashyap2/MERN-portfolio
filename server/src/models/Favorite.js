const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['hotel', 'place', 'restaurant', 'temple', 'gurudwara', 'trip'],
      required: true,
    },
    placeId: { type: String, default: '', index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    title: { type: String, required: true, maxlength: 160 },
    subtitle: { type: String, default: '', maxlength: 160 },
    image: { type: String, default: '', maxlength: 400 },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, createdAt: -1 });
favoriteSchema.index({ userId: 1, placeId: 1, type: 1 });

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('Favorite', favoriteSchema);
