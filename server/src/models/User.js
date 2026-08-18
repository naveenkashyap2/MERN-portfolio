import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    preferences: {
      travelStyle: { type: String, enum: ["budget", "comfort", "luxury"], default: "comfort" },
      interests: { type: [String], default: [] },
      language: { type: String, enum: ["hindi","english","marathi","kannada"], default: "hindi" },
    },
    history: [{
      destination: String,
      from: String,
      days: Number,
      visitedAt: { type: Date, default: Date.now },
      tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    }],
    stats: {
      totalTrips: { type: Number, default: 0 },
      totalDistanceKm: { type: Number, default: 0 },
      totalSteps: { type: Number, default: 0 },
    },
    googleId: { type: String, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
