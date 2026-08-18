import mongoose from "mongoose";
import { config } from "./env.js";

let isConnected = false;
let memoryFallback = false;

export const connectDB = async () => {
  if (!config.mongoUri || config.mongoUri.includes("localhost")) {
    console.log("⚠️  No cloud Mongo URI found, trying local. If fails, will use in-memory fallback.");
  }
  try {
    if (config.mongoUri) {
      await mongoose.connect(config.mongoUri, {
        autoIndex: true,
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      });
      isConnected = true;
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } else {
      throw new Error("No MONGO_URI");
    }
  } catch (err) {
    console.warn(`⚠️  MongoDB connection failed: ${err.message}`);
    console.warn("🔄 Falling back to in-memory storage (data will not persist across restarts). Set MONGO_URI for persistence.");
    memoryFallback = true;
  }
};

export const isDBConnected = () => isConnected;
export const isMemoryFallback = () => memoryFallback;
