const mongoose = require('mongoose');
const { ROLES, TRANSPORT, STAY, INTERESTS } = require('../constants');

const preferencesSchema = new mongoose.Schema(
  {
    travelStyle: { type: String, default: '', maxlength: 80 },
    budgetPreference: { type: String, enum: ['', 'budget', 'comfort', 'premium'], default: '' },
    preferredTransport: { type: String, enum: ['', ...TRANSPORT], default: '' },
    preferredHotel: { type: String, enum: ['', ...STAY], default: '' },
    favoriteCategories: { type: [String], default: [] },
    travelFrequency: { type: String, default: '', maxlength: 40 },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.every((i) => INTERESTS.includes(i)),
        message: 'Invalid interest',
      },
    },
    language: { type: String, default: 'en', maxlength: 8 },
    theme: { type: String, enum: ['dark', 'system'], default: 'dark' },
    notifications: {
      tripReminder: { type: Boolean, default: true },
      budgetWarning: { type: Boolean, default: true },
      aiRecommendation: { type: Boolean, default: true },
      transportUpdate: { type: Boolean, default: true },
    },
    location: {
      trackingEnabled: { type: Boolean, default: false },
      historyEnabled: { type: Boolean, default: false },
    },
    ai: {
      rememberTripContext: { type: Boolean, default: true },
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    passwordHash: { type: String, default: '', select: false },
    googleId: { type: String, default: '', index: true },
    avatar: { type: String, default: '', maxlength: 400 },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyTokenHash: { type: String, default: '', select: false },
    emailVerifyExpires: { type: Date, default: null, select: false },
    passwordResetTokenHash: { type: String, default: '', select: false },
    passwordResetExpires: { type: Date, default: null, select: false },
    preferences: { type: preferencesSchema, default: () => ({}) },
    onboardingCompleted: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);



const { defineModel } = require('../db/modelFactory');

module.exports = defineModel('User', userSchema, {
  hidden: [
    'passwordHash',
    'emailVerifyTokenHash',
    'emailVerifyExpires',
    'passwordResetTokenHash',
    'passwordResetExpires',
  ],
  unique: ['email'],
});
