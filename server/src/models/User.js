import mongoose from 'mongoose';

const preferencesSchema = new mongoose.Schema(
  {
    travelStyle: { type: String, enum: ['budget', 'comfort', 'premium', null], default: null },
    budgetPreference: { type: Number, min: 0, default: null },
    transport: { type: String, enum: ['train', 'bus', 'car', 'walking', 'any', null], default: null },
    stay: { type: String, enum: ['budget', 'medium', 'premium', 'none', null], default: null },
    interests: [{ type: String }],
    travelFrequency: { type: String, default: null },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String, select: false },
    resetTokenHash: { type: String, select: false },
    resetTokenExpiresAt: { type: Date, select: false },
    preferences: { type: preferencesSchema, default: () => ({}) },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ createdAt: -1 });

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    preferences: this.preferences,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  };
};

export default mongoose.model('User', userSchema);
