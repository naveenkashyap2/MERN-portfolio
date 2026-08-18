import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['transport', 'hotel', 'food', 'shopping', 'activities', 'other'],
      required: true,
    },
    description: { type: String, maxlength: 200 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

expenseSchema.index({ tripId: 1, date: -1 });

export default mongoose.model('Expense', expenseSchema);
