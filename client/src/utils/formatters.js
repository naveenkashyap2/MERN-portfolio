export { inr } from './currency.js';
export { formatDate } from './date.js';
export { formatKm, formatMins } from './distance.js';

export function travelerLabel(travelers = {}) {
  const n = (travelers.adults || 0) + (travelers.children || 0);
  return `${n} Traveler${n === 1 ? '' : 's'}`;
}

export function trustTone(trust) {
  if (trust === 'LIVE VERIFIED') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  if (String(trust || '').includes('AI')) return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
  if (trust === 'CACHED') return 'bg-amber-500/15 text-amber-200 border-amber-500/30';
  return 'bg-white/5 text-ink-mute border-white/10';
}
