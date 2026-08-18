const { ApiError } = require('./ApiError');
const mongoose = require('mongoose');

function assert(condition, message, status = 400, code = 'VALIDATION_ERROR') {
  if (!condition) throw new ApiError(status, message, { code });
}

function objectId(id, name = 'id') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${name}.`, { code: 'INVALID_ID' });
  }
  return id;
}

function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
}

function rejectUnknown(body, allowed) {
  const extra = Object.keys(body || {}).filter((k) => !allowed.includes(k));
  if (extra.length) {
    throw new ApiError(400, `Unexpected fields: ${extra.join(', ')}`, {
      code: 'UNEXPECTED_FIELDS',
    });
  }
}

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function coord(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new ApiError(400, 'Invalid coordinates.', { code: 'INVALID_COORDINATES' });
  }
  return { lat: latitude, lng: longitude };
}

module.exports = { assert, objectId, pick, rejectUnknown, isEmail, coord };
