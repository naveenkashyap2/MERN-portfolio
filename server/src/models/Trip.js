import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: String,
  description: String,
  time: String,
  duration: String,
  cost: String,
  category: String,
  lat: Number,
  lng: Number,
  image: String,
  tips: String,
}, { _id: false });

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  theme: String,
  places: [placeSchema],
  totalCost: String,
}, { _id: false });

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    source: String,
    destination: String,
    days: Number,
    travelers: Number,
    budget: Number,
    budgetType: String,
    interests: [String],
    travelStyle: String,
    itinerary: [daySchema],
    overview: {
      totalEstimatedCost: String,
      bestTimeToVisit: String,
      localCuisine: [String],
      packingTips: [String],
      transportTips: String,
    },
    transportOptions: {
      highway: { name: String, distance: String, duration: String, cost: String, best: String },
      train: {
        name: String,
        recommendation: String,
        options: [{ name: String, time: String, duration: String, price: String, status: String, from: String, to: String }]
      },
      flight: { name: String, distance: String, duration: String, cost: String, note: String },
      local: { name: String, note: String }
    },
    hotels: [{ name: String, area: String, pricePerNight: String, rating: String, why: String }],
    food: [{ dish: String, where: String, cost: String }],
    budgetBreakdown: { stay: String, food: String, transport: String, activities: String, total: String },
    mapCenter: { lat: Number, lng: Number },
    srcCenter: { lat: Number, lng: Number },
    views: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ isPublic: 1, views: -1 });

export default mongoose.model("Trip", tripSchema);
