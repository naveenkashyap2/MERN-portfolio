const EARTH_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

function walkingEtaMinutes(km, speedKmh = 4.8) {
  if (km < 0) return 0;
  return Math.round((km / speedKmh) * 60);
}

function drivingEtaMinutes(km, speedKmh = 40) {
  return Math.round((km / speedKmh) * 60);
}

function inRadius(point, dest, meters) {
  return haversineKm(point, dest) * 1000 <= meters;
}

module.exports = { haversineKm, walkingEtaMinutes, drivingEtaMinutes, inRadius };
