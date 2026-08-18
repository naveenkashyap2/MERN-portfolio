const mongoose = require('mongoose');
const { env } = require('./env');
const { logger } = require('./logger');

let memory = false;

async function connectDb() {
  mongoose.set('strictQuery', true);

  if (env.useInMemoryDb) {
    memory = true;
    logger.info('Using in-process data store (set MONGODB_URI for MongoDB Atlas)');
    return { memory: true };
  }

  await mongoose.connect(env.mongoUri, { autoIndex: true });
  logger.info('Connected to MongoDB');
  return mongoose.connection;
}

async function disconnectDb() {
  if (memory) {
    const { resetMemory } = require('../db/memoryModel');
    resetMemory();
    memory = false;
    return;
  }
  await mongoose.disconnect();
}

function dbStatus() {
  if (memory || env.useInMemoryDb) {
    return { state: 'connected', inMemory: true, engine: 'process-memory' };
  }
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    inMemory: false,
  };
}

module.exports = { connectDb, disconnectDb, dbStatus };
