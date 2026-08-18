import mongoose from 'mongoose';

const itineraryItemSchema = new mongoose.Schema(
  {
    time: { type: String, required: true }, // "08:00"
    endTime: { type: String },
    place: { type: String, required: true },
    category: { type: String },
    duration: { type: String },
    distance: { type: String },
    transport: { type: String, enum: ['walk', 'auto', 'taxi', 'train', 'bus', 'metro', null] },
    cost: { type: Number, default: 0 },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    notes: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    imageSlug: { type: String },
  },
  { _id: true },
);

const daySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String },
    summary: { type: String },
    items: { type: [itineraryItemSchema], default: [] },
  },
  { _id: true },
);

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    travelers: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
    },
    budget: { type: Number, required: true, min: 0 },
    travelStyle: { type: String, enum: ['budget', 'comfort', 'premium'], default: 'comfort' },
    transportPreference: {
      type: String,
      enum: ['train', 'bus', 'car', 'walking', 'any'],
      default: 'any',
    },
    stayPreference: { type: String, enum: ['budget', 'medium', 'premium', 'none'], default: 'medium' },
    interests: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'planned', 'active', 'completed', 'cancelled'],
      default: 'planned',
    },
    overview: { type: String },
    itinerary: { type: [daySchema], default: [] },
    budgetBreakdown: {
      type: Map,
      of: Number,
      default: {},
    },
    shareToken: { type: String, unique: true, sparse: true },
    shareEnabled: { type: Boolean, default: false },
    aiGenerated: { type: Boolean, default: false },
    aiModel: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

tripSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Trip', tripSchema);
