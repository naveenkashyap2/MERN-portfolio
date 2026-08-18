import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

let connected = false;

/**
 * Connect to MongoDB when a MONGODB_URI is provided.
 *
 * When no URI is configured (or USE_MEMORY_STORE=true) the API runs in a
 * self-contained demo mode backed by the in-memory store so the product can
 * be evaluated without external infrastructure. Production always requires
 * MongoDB (enforced in config/env.js).
 */
export async function connectDB() {
  if (!env.MONGODB_URI || env.useMemoryStore) {
    logger.warn('[db] No MONGODB_URI — running with in-memory store (demo mode)');
    connected = false;
    return { mode: 'memory', connected: false };
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 8000,
    });
    connected = true;
    logger.success(`[db] MongoDB connected: ${mongoose.connection.host}`);
    return { mode: 'mongo', connected: true };
  } catch (err) {
    logger.error('[db] MongoDB connection failed:', err.message);
    logger.warn('[db] Falling back to in-memory store');
    connected = false;
    return { mode: 'memory', connected: false };
  }
}

export function isDbConnected() {
  return connected;
}

export default { connectDB, isDbConnected };
