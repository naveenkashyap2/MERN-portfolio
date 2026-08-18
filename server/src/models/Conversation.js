const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true, maxlength: 8000 },
    cards: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    title: { type: String, default: 'New conversation', maxlength: 120 },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

conversationSchema.index({ userId: 1, updatedAt: -1 });

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('Conversation', conversationSchema);
