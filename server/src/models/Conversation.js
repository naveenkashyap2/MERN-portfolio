import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    kind: {
      type: String,
      enum: ['text', 'place', 'hotel', 'route', 'itinerary', 'budget', 'error'],
      default: 'text',
    },
    data: { type: mongoose.Schema.Types.Mixed, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', index: true },
    title: { type: String, default: 'New conversation' },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true },
);

conversationSchema.index({ userId: 1, updatedAt: -1 });

export const Message = mongoose.model('Message', messageSchema);
export default mongoose.model('Conversation', conversationSchema);
