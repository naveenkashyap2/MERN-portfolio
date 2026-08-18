export function formatINR(value, compact = false) {
  const n = Number(value || 0);
  if (compact && n >= 1000) {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  }
  return `₹${n.toLocaleString('en-IN')}`;
}
