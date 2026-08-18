export function progressPct(travelled, remaining) {
  const total = (travelled || 0) + (remaining || 0);
  if (!total) return 0;
  return Math.min(100, Math.round(((travelled || 0) / total) * 100));
}
