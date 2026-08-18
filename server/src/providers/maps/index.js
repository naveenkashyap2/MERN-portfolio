import { haversineMeters, walkingMinutes } from '../../utils/distance.js';

/**
 * Maps / routing provider adapter.
 *
 * Demo implementation computes straight-line distance + a curved polyline.
 * Swap for OSRM / Google Routes / Mapbox Directions in production. Results
 * are labelled "estimate" until a verified routing engine is connected.
 */

const WALK_SPEED_KMH = 4.5;
const DRIVE_SPEED_KMH = 32; // city average

function buildPolyline(a, b, bend = 0.12) {
  const mx = (a.lng + b.lng) / 2;
  const my = (a.lat + b.lat) / 2;
  // perpendicular offset for a gentle arc
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bend;
  const cy = my + (dx / len) * bend;
  return [a, { lat: cy, lng: cx }, b];
}

export const mapsProvider = {
  planRoute({ mode = 'walking', origin, destination } = {}) {
    const meters = haversineMeters(origin.lat, origin.lng, destination.lat, destination.lng);
    const speed = mode === 'walking' ? WALK_SPEED_KMH : DRIVE_SPEED_KMH;
    const minutes = mode === 'walking' ? walkingMinutes(meters) : Math.max(1, Math.round((meters / 1000 / speed) * 60));
    return {
      mode,
      distanceMeters: Math.round(meters),
      durationMinutes: minutes,
      polyline: buildPolyline(origin, destination),
      source: 'estimate',
      disclaimer: 'Route is an estimate — connect a routing provider for turn-by-turn directions.',
    };
  },

  compare({ origin, destination } = {}) {
    const walk = this.planRoute({ mode: 'walking', origin, destination });
    const drive = this.planRoute({ mode: 'driving', origin, destination });
    return {
      walking: { ...walk, label: 'Walking', note: 'Free & immersive' },
      driving: { ...drive, label: 'Driving', note: 'Fastest door-to-door' },
      source: 'estimate',
    };
  },
};
