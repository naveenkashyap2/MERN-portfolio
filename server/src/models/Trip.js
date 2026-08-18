import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  time: { type: String },
  duration: { type: String },
  cost: { type: String },
  category: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  image: { type: String },
  tips: { type: String },
}, { _id: false });

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String },
  theme: { type: String },
  places: [placeSchema],
  totalCost: { type: String },
}, { _id: false });

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    title: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    days: { type: Number, required: true, min: 1, max: 30 },
    travelers: { type: Number, required: true, min: 1 },
    budget: { type: Number, required: true },
    budgetType: { type: String, enum: ["total", "per_person"], default: "total" },
    interests: { type: [String], default: [] },
    travelStyle: { type: String, enum: ["budget","comfort","luxury"], default: "comfort" },
    itinerary: [daySchema],
    overview: {
      totalEstimatedCost: { type: String },
      bestTimeToVisit: { type: String },
      localCuisine: { type: [String] },
      packingTips: { type: [String] },
      transportTips: { type: String },
    },
    hotels: [{
      name: String,
      area: String,
      pricePerNight: String,
      rating: String,
      why: String,
    }],
    food: [{
      dish: String,
      where: String,
      cost: String,
    }],
    budgetBreakdown: {
      stay: String,
      food: String,
      transport: String,
      activities: String,
      total: String,
    },
    mapCenter: {
      lat: Number,
      lng: Number,
    },
    status: { type: String, enum: ["draft","saved","shared"], default: "saved" },
    views: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ isPublic: 1, views: -1 });

export default mongoose.model("Trip", tripSchema);
