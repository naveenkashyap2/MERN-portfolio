const mongoose = require('mongoose');
const { EXPENSE_CATEGORIES } = require('../constants');

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    amount: { type: Number, required: true, min: 0, max: 10000000 },
    category: { type: String, enum: EXPENSE_CATEGORIES, required: true },
    description: { type: String, default: '', maxlength: 240 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

expenseSchema.index({ tripId: 1, createdAt: -1 });

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('Expense', expenseSchema);
