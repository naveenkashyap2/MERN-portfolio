const mongoose = require('mongoose');
const { TRIP_STATUS, TRANSPORT, STAY, INTERESTS } = require('../constants');

const placeRefSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', maxlength: 160 },
    city: { type: String, default: '', maxlength: 80 },
    state: { type: String, default: '', maxlength: 80 },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    coordinatesVerified: { type: Boolean, default: false },
  },
  { _id: false }
);

const itineraryItemSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1 },
    startTime: { type: String, default: '', maxlength: 8 },
    endTime: { type: String, default: '', maxlength: 8 },
    durationMinutes: { type: Number, default: 60 },
    title: { type: String, required: true, maxlength: 160 },
    location: { type: String, default: '', maxlength: 160 },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    coordinatesVerified: { type: Boolean, default: false },
    distanceKm: { type: Number, default: null },
    transportMode: { type: String, default: '', maxlength: 40 },
    estimatedCost: { type: Number, default: 0, min: 0 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: { type: String, default: 'other', maxlength: 40 },
    notes: { type: String, default: '', maxlength: 500 },
    trust: { type: String, default: 'ESTIMATED', maxlength: 32 },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const hotelPickSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', maxlength: 160 },
    category: { type: String, enum: [...STAY, ''], default: '' },
    estimatedPrice: { type: Number, default: null },
    area: { type: String, default: '', maxlength: 160 },
    trust: { type: String, default: 'ESTIMATED' },
    availabilityStatus: { type: String, default: 'unverified' },
    notes: { type: String, default: '', maxlength: 400 },
  },
  { _id: false }
);

const transportPickSchema = new mongoose.Schema(
  {
    mode: { type: String, default: '', maxlength: 40 },
    estimatedDuration: { type: String, default: '', maxlength: 40 },
    estimatedCost: { type: Number, default: null },
    trust: { type: String, default: 'ESTIMATED' },
    notes: { type: String, default: '', maxlength: 400 },
  },
  { _id: false }
);

const expensePlanSchema = new mongoose.Schema(
  {
    category: { type: String, default: 'other' },
    estimated: { type: Number, default: 0 },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: '', maxlength: 160 },
    origin: { type: placeRefSchema, required: true },
    destination: { type: placeRefSchema, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: {
      adults: { type: Number, default: 1, min: 1, max: 20 },
      children: { type: Number, default: 0, min: 0, max: 20 },
    },
    budget: { type: Number, required: true, min: 0, max: 10000000 },
    travelStyle: { type: String, default: '', maxlength: 80 },
    transportPreference: { type: String, enum: TRANSPORT, default: 'any' },
    stayPreference: { type: String, enum: STAY, default: 'medium' },
    interests: { type: [String], default: [] },
    status: { type: String, enum: Object.values(TRIP_STATUS), default: TRIP_STATUS.DRAFT },
    itinerary: { type: [itineraryItemSchema], default: [] },
    hotels: { type: [hotelPickSchema], default: [] },
    transport: { type: [transportPickSchema], default: [] },
    expensePlan: { type: [expensePlanSchema], default: [] },
    aiSummary: { type: String, default: '', maxlength: 2000 },
    aiSource: { type: String, enum: ['gemini', 'template', 'user', 'none'], default: 'none' },
    share: {
      token: { type: String, default: '' },
      mode: { type: String, enum: ['private', 'view', 'collaborative'], default: 'private' },
    },
    generationMeta: {
      model: { type: String, default: '' },
      latencyMs: { type: Number, default: null },
      validated: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

tripSchema.index({ userId: 1, createdAt: -1 });
tripSchema.index({ 'share.token': 1 }, { sparse: true });
tripSchema.index({ status: 1 });

tripSchema.pre('validate', function validateDates() {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date must be on or after start date.');
  }
  if (this.interests?.some((i) => !INTERESTS.includes(i))) {
    this.invalidate('interests', 'Invalid interest.');
  }
});

const { defineModel } = require('../db/modelFactory');
module.exports = defineModel('Trip', tripSchema);
