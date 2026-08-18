const { UNVERIFIED_LIVE, TRUST } = require('../../constants');
const { findCity } = require('../places/catalogPlacesProvider');
const { haversineKm, drivingEtaMinutes } = require('../../utils/distance');

function corridorEstimate(from, to) {
  const a = findCity(from);
  const b = findCity(to);
  if (!a || !b) return null;
  const km = Number(haversineKm(a, b).toFixed(1));
  return { km, from: a, to: b };
}

function searchTrains({ from, to }) {
  const corridor = corridorEstimate(from, to);
  return {
    items: [],
    live: false,
    trust: TRUST.ESTIMATED,
    message: UNVERIFIED_LIVE,
    estimate: corridor
      ? {
          typicalDuration: `${Math.max(2, Math.round(corridor.km / 65))}h–${Math.max(3, Math.round(corridor.km / 45))}h`,
          typicalFareRange: 'Provider required for fare',
          distanceKm: corridor.km,
          trust: TRUST.ESTIMATED,
        }
      : null,
  };
}

function getTrain() {
  return { item: null, live: false, message: UNVERIFIED_LIVE };
}

function searchBuses({ from, to }) {
  const corridor = corridorEstimate(from, to);
  return {
    items: [],
    live: false,
    trust: TRUST.ESTIMATED,
    message: UNVERIFIED_LIVE,
    estimate: corridor
      ? {
          typicalDuration: `${Math.max(3, Math.round(corridor.km / 45))}h–${Math.max(4, Math.round(corridor.km / 32))}h`,
          typicalFareRange: 'Provider required for fare',
          distanceKm: corridor.km,
          trust: TRUST.ESTIMATED,
        }
      : null,
  };
}

function compare({ from, to }) {
  const corridor = corridorEstimate(from, to);
  if (!corridor) {
    return { live: false, message: UNVERIFIED_LIVE, options: [] };
  }
  const km = corridor.km;
  return {
    live: false,
    message: UNVERIFIED_LIVE,
    trust: TRUST.ESTIMATED,
    options: [
      {
        mode: 'train',
        durationMinutes: Math.round((km / 55) * 60),
        estimatedCost: null,
        label: 'Best for speed (estimate)',
        trust: TRUST.ESTIMATED,
      },
      {
        mode: 'bus',
        durationMinutes: Math.round((km / 38) * 60),
        estimatedCost: null,
        label: 'Often cheaper (estimate)',
        trust: TRUST.ESTIMATED,
      },
      {
        mode: 'car',
        durationMinutes: drivingEtaMinutes(km, 50),
        estimatedCost: Math.round(km * 12),
        label: 'Most comfortable (fuel estimate)',
        trust: TRUST.ESTIMATED,
      },
    ],
  };
}

module.exports = {
  searchTrains,
  getTrain,
  searchBuses,
  getBus: getTrain,
  compare,
  status: () => ({ name: 'unverified', connected: false, live: false }),
};
