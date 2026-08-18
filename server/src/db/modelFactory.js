const mongoose = require('mongoose');
const { env } = require('../config/env');
const { createMemoryModel } = require('./memoryModel');

function hiddenFromSchema(schema) {
  const hidden = [];
  if (!schema?.paths) return hidden;
  Object.entries(schema.paths).forEach(([key, path]) => {
    if (path.options && path.options.select === false) hidden.push(key);
  });
  return hidden;
}

function defineModel(name, schema, extras = {}) {
  if (env.useInMemoryDb) {
    return createMemoryModel(name, {
      hidden: extras.hidden || hiddenFromSchema(schema),
      unique: extras.unique || [],
    });
  }
  return mongoose.models[name] || mongoose.model(name, schema);
}

module.exports = { defineModel };
