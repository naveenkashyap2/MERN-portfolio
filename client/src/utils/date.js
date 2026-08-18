export function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function nightsBetween(start, end) {
  if (!start || !end) return 0;
  const ms = new Date(end) - new Date(start);
  return Math.max(0, Math.round(ms / 86400000));
}

export function daysBetween(start, end) {
  return nightsBetween(start, end) + 1;
}
