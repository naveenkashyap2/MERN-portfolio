const { TRUST } = require('../constants');
const { findCity, placesInCity } = require('../providers/places/catalogPlacesProvider');

const CATEGORIES = new Set([
  'temple',
  'gurudwara',
  'historical',
  'nature',
  'food',
  'hotel',
  'transport',
  'shopping',
  'adventure',
  'spiritual',
  'other',
  'mosque',
  'church',
]);

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asTime(value, fallback = '09:00') {
  if (typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) return value;
  return fallback;
}

function sanitizeItem(raw, index, day) {
  const title = String(raw.title || raw.location || 'Activity').slice(0, 160);
  return {
    day,
    startTime: asTime(raw.startTime, '09:00'),
    endTime: asTime(raw.endTime, '10:00'),
    durationMinutes: Math.min(480, Math.max(15, asNumber(raw.durationMinutes, 60))),
    title,
    location: String(raw.location || title).slice(0, 160),
    lat: null,
    lng: null,
    coordinatesVerified: false,
    distanceKm: raw.distanceKm != null ? asNumber(raw.distanceKm, null) : null,
    transportMode: String(raw.transportMode || 'walk').slice(0, 40),
    estimatedCost: Math.max(0, asNumber(raw.estimatedCost, 0)),
    priority: ['low', 'medium', 'high'].includes(raw.priority) ? raw.priority : 'medium',
    category: CATEGORIES.has(raw.category) ? raw.category : 'other',
    notes: String(raw.notes || '').slice(0, 500),
    trust: TRUST.AI_ESTIMATE,
    order: index,
  };
}

function attachCatalogCoords(items, destinationName) {
  const catalog = placesInCity(destinationName);
  const originCity = findCity(destinationName);
  return items.map((item) => {
    const match = catalog.find(
      (p) =>
        item.title.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(item.title.toLowerCase()) ||
        item.location.toLowerCase().includes(p.name.toLowerCase())
    );
    if (match) {
      return {
        ...item,
        lat: match.lat,
        lng: match.lng,
        coordinatesVerified: true,
        location: match.name,
        category: item.category === 'other' ? match.category : item.category,
      };
    }
    if (originCity && /breakfast|lunch|dinner|hotel|check-?in|rest/i.test(item.title)) {
      return item;
    }
    return item;
  });
}

function validatePlan(raw, expected) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('invalid_plan_shape');
  }
  const duration = Math.max(1, asNumber(raw.duration, expected.durationDays));
  const days = Array.isArray(raw.days) ? raw.days : [];
  let itinerary = [];
  days.forEach((d) => {
    const dayNum = Math.max(1, asNumber(d.day, 1));
    const items = Array.isArray(d.items) ? d.items : [];
    items.forEach((it, idx) => itinerary.push(sanitizeItem(it, itinerary.length + idx, dayNum)));
  });
  itinerary = itinerary.filter((i) => i.day <= duration).slice(0, duration * 12);
  itinerary = attachCatalogCoords(itinerary, expected.destination);

  const hotels = (Array.isArray(raw.hotels) ? raw.hotels : []).slice(0, 5).map((h) => ({
    name: String(h.name || 'Stay area').slice(0, 160),
    category: ['budget', 'medium', 'premium', 'none'].includes(h.category)
      ? h.category
      : expected.stayPreference,
    estimatedPrice: h.estimatedPrice != null ? asNumber(h.estimatedPrice, null) : null,
    area: String(h.area || '').slice(0, 160),
    trust: TRUST.AI_RECOMMENDED,
    availabilityStatus: 'unverified',
    notes: String(h.notes || 'Live availability could not be verified.').slice(0, 400),
  }));

  const transport = (Array.isArray(raw.transport) ? raw.transport : []).slice(0, 5).map((t) => ({
    mode: String(t.mode || expected.transportPreference).slice(0, 40),
    estimatedDuration: String(t.estimatedDuration || '').slice(0, 40),
    estimatedCost: t.estimatedCost != null ? asNumber(t.estimatedCost, null) : null,
    trust: TRUST.AI_ESTIMATE,
    notes: String(t.notes || 'Live availability could not be verified.').slice(0, 400),
  }));

  const expensePlan = (Array.isArray(raw.expenses) ? raw.expenses : []).slice(0, 10).map((e) => ({
    category: String(e.category || 'other'),
    estimated: Math.max(0, asNumber(e.estimated, 0)),
  }));

  const budget = Math.max(0, asNumber(raw.budget, expected.budget));

  return {
    destination: String(raw.destination || expected.destination).slice(0, 80),
    duration,
    budget,
    summary: String(raw.summary || '').slice(0, 2000),
    itinerary,
    hotels,
    transport,
    expensePlan,
  };
}

module.exports = { validatePlan, attachCatalogCoords };
