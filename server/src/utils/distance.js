/**
 * Haversine great-circle distance between two coordinates (in meters).
 */
export function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function metersToKm(m) {
  return Math.round((m / 1000) * 10) / 10;
}

export function formatKm(meters) {
  const km = meters / 1000;
  if (km < 1) return `${Math.round(meters)} m`;
  return `${Math.round(km * 10) / 10} km`;
}

/** Rough walking ETA in minutes at ~4.5 km/h. */
export function walkingMinutes(meters) {
  const hours = meters / 1000 / 4.5;
  return Math.max(1, Math.round(hours * 60));
}

export function formatDurationMinutes(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${String(m).padStart(2, '0')}m` : `${h}h`;
}
