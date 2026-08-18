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
    },
  },
  { timestamps: true }
);


export default mongoose.model("User", userSchema);
