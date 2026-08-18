export function boundsFrom(points) {
  const valid = points.filter((p) => p && p.lat != null && p.lng != null);
  if (!valid.length) return null;
  return valid.map((p) => [p.lat, p.lng]);
}
