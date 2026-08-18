const { placesInCity, findCity } = require('../providers/places/catalogPlacesProvider');
const { STAY_AREAS, FOOD } = require('../data/indiaCatalog');
const { TRUST } = require('../constants');
const { haversineKm } = require('../utils/distance');

const DAY_SLOTS = [
  { startTime: '08:00', endTime: '08:45', title: 'Breakfast', category: 'food', durationMinutes: 45, estimatedCost: 200, priority: 'medium' },
  { startTime: '09:00', endTime: '11:30', title: null, category: null, durationMinutes: 150, estimatedCost: 0, priority: 'high' },
  { startTime: '11:45', endTime: '13:15', title: null, category: null, durationMinutes: 90, estimatedCost: 0, priority: 'high' },
  { startTime: '13:30', endTime: '14:30', title: 'Lunch', category: 'food', durationMinutes: 60, estimatedCost: 350, priority: 'medium' },
  { startTime: '15:00', endTime: '17:00', title: null, category: null, durationMinutes: 120, estimatedCost: 0, priority: 'medium' },
  { startTime: '17:30', endTime: '18:30', title: null, category: null, durationMinutes: 60, estimatedCost: 0, priority: 'medium' },
  { startTime: '20:00', endTime: '21:00', title: 'Dinner', category: 'food', durationMinutes: 60, estimatedCost: 400, priority: 'medium' },
];

function scorePlace(place, interests) {
  let score = place.rating || 4;
  if (interests.includes(place.category)) score += 3;
  if (interests.includes('spiritual') && ['temple', 'gurudwara', 'mosque', 'church', 'spiritual'].includes(place.category)) {
    score += 2;
  }
  return score;
}

function nearestFirst(places) {
  if (!places.length) return places;
  const used = new Set();
  const ordered = [];
  let current = places[0];
  ordered.push(current);
  used.add(current.id);
  while (ordered.length < places.length) {
    let best = null;
    let bestD = Infinity;
    for (const p of places) {
      if (used.has(p.id)) continue;
      const d = haversineKm(current, p);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    if (!best) break;
    ordered.push(best);
    used.add(best.id);
    current = best;
  }
  return ordered;
}

function buildTemplatePlan(input) {
  const destCity = findCity(input.destination);
  const destName = destCity?.name || input.destination;
  const interests = (input.interests || []).map((i) => i.toLowerCase());
  let places = placesInCity(destName);
  if (!places.length) places = placesInCity('Delhi');

  places = nearestFirst(
    [...places].sort((a, b) => scorePlace(b, interests) - scorePlace(a, interests))
  );

  const days = Math.max(1, input.durationDays || 1);
  const perDay = 4;
  const itinerary = [];
  let placeIdx = 0;

  for (let day = 1; day <= days; day += 1) {
    const dayPlaces = [];
    for (let i = 0; i < perDay && placeIdx < places.length; i += 1) {
      dayPlaces.push(places[placeIdx]);
      placeIdx += 1;
    }
    if (!dayPlaces.length && places.length) dayPlaces.push(places[(day - 1) % places.length]);

    let p = 0;
    DAY_SLOTS.forEach((slot, order) => {
      if (slot.title) {
        const food = FOOD.find((f) => f.city.toLowerCase() === destName.toLowerCase());
        itinerary.push({
          day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          durationMinutes: slot.durationMinutes,
          title: slot.title,
          location: destName,
          lat: destCity?.lat ?? null,
          lng: destCity?.lng ?? null,
          coordinatesVerified: Boolean(destCity),
          distanceKm: null,
          transportMode: 'walk',
          estimatedCost: Math.round(slot.estimatedCost * (input.travelers?.adults || 1)),
          priority: slot.priority,
          category: slot.category,
          notes: food?.notes || '',
          trust: TRUST.ESTIMATED,
          order: order + day * 20,
        });
        return;
      }
      const place = dayPlaces[p];
      p += 1;
      if (!place) return;
      itinerary.push({
        day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        durationMinutes: place.durationMin || slot.durationMinutes,
        title: place.name,
        location: place.name,
        lat: place.lat,
        lng: place.lng,
        coordinatesVerified: true,
        distanceKm: null,
        transportMode: 'walk',
        estimatedCost: place.entryFee || 0,
        priority: interests.includes(place.category) ? 'high' : 'medium',
        category: place.category,
        notes: place.description,
        trust: TRUST.CATALOG,
        order: order + day * 20,
      });
    });
  }

  const stayCat = input.stayPreference === 'none' ? null : input.stayPreference || 'medium';
  const hotels = stayCat
    ? STAY_AREAS.filter((s) => s.city.toLowerCase() === destName.toLowerCase() && s.category === stayCat)
        .slice(0, 2)
        .map((s) => ({
          name: s.name,
          category: s.category,
          estimatedPrice: s.estimatedPrice,
          area: s.area,
          trust: TRUST.CATALOG,
          availabilityStatus: 'unverified',
          notes: 'Live availability could not be verified.',
        }))
    : [];

  const hotelCost = hotels[0]?.estimatedPrice ? hotels[0].estimatedPrice * Math.max(1, days - 1) : 0;
  const foodCost = 900 * days * (input.travelers?.adults || 1);
  const entry = itinerary.reduce((s, i) => s + (i.estimatedCost || 0), 0);
  const localTransport = 400 * days;

  return {
    destination: destName,
    duration: days,
    budget: input.budget,
    summary: `${days}-day ${destName} plan from ${input.origin}, tuned to ${(interests.join(', ') || 'balanced interests')}. Estimates only — not live bookings.`,
    itinerary,
    hotels,
    transport: [
      {
        mode: input.transportPreference || 'any',
        estimatedDuration: '',
        estimatedCost: null,
        trust: TRUST.ESTIMATED,
        notes: 'Live availability could not be verified.',
      },
    ],
    expensePlan: [
      { category: 'hotel', estimated: hotelCost },
      { category: 'food', estimated: foodCost },
      { category: 'entry_fees', estimated: entry },
      { category: 'transport', estimated: localTransport },
    ],
  };
}

function optimizeBudget(plan, newBudget) {
  const next = JSON.parse(JSON.stringify(plan));
  const ratio = newBudget / Math.max(1, plan.budget || newBudget);
  next.budget = newBudget;
  next.itinerary = next.itinerary.map((item) => {
    if (item.category === 'food') {
      return { ...item, estimatedCost: Math.round(item.estimatedCost * Math.min(1, ratio + 0.15)), notes: `${item.notes} Cheaper meal option suggested.` };
    }
    return item;
  });
  next.hotels = next.hotels.map((h) => ({
    ...h,
    category: newBudget < 4000 ? 'budget' : h.category,
    estimatedPrice: h.estimatedPrice ? Math.round(h.estimatedPrice * Math.min(1, ratio)) : h.estimatedPrice,
    notes: 'Downgraded stay estimate to fit the new budget. Live availability could not be verified.',
  }));
  next.expensePlan = next.expensePlan.map((e) => ({
    ...e,
    estimated: Math.round(e.estimated * Math.min(1, ratio)),
  }));
  next.summary = `Budget revised to ₹${newBudget}. High-priority places kept; stays and meals tightened.`;
  return next;
}

function replanLate(plan) {
  const next = JSON.parse(JSON.stringify(plan));
  next.itinerary = next.itinerary.filter((item) => item.priority !== 'low' && item.category !== 'shopping');
  next.summary = 'Replanned for less time — lower-priority stops removed. High-priority places kept.';
  return next;
}

module.exports = { buildTemplatePlan, optimizeBudget, replanLate };
