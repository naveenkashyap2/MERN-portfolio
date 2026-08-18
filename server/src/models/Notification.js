const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'trip_reminder',
        'departure',
        'arrival',
        'budget_warning',
        'ai_recommendation',
        'transport_update',
        'hotel_reminder',
      ],
      required: true,
    },
    title: { type: String, required: true, maxlength: 160 },
    body: { type: String, default: '', maxlength: 400 },
    readAt: { type: Date, default: null },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('Notification', notificationSchema);
