export function formatKm(meters) {
  if (meters === null || meters === undefined) return '—';
  const km = meters / 1000;
  if (km < 1) return `${Math.round(meters)} m`;
  return `${Math.round(km * 10) / 10} km`;
}

export function formatDurationMinutes(minutes) {
  if (!minutes && minutes !== 0) return '—';
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${String(rem).padStart(2, '0')}m` : `${h}h`;
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}
