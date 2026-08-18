import { z } from 'zod';
import { geminiProvider } from '../providers/gemini/index.js';
import { placesProvider } from '../providers/places/index.js';
import { hotelsProvider } from '../providers/hotels/index.js';
import { transportProvider } from '../providers/transport/index.js';
import { mapsProvider } from '../providers/maps/index.js';
import { buildTripPlannerPrompt } from '../prompts/tripPlanner.prompt.js';
import { buildAssistantPrompt } from '../prompts/assistant.prompt.js';
import { haversineMeters, formatKm, walkingMinutes, formatDurationMinutes } from '../utils/distance.js';
import logger from '../utils/logger.js';

/* ----------------------------- city helpers ------------------------------ */
const CITY_ALIASES = {
  delhi: 'New Delhi',
  'new delhi': 'New Delhi',
  dilli: 'New Delhi',
  agra: 'Agra',
  jaipur: 'Jaipur',
  varanasi: 'Varanasi',
  banaras: 'Varanasi',
  kashi: 'Varanasi',
  amritsar: 'Amritsar',
  mumbai: 'Mumbai',
  bombay: 'Mumbai',
  rishikesh: 'Rishikesh',
  srinagar: 'Srinagar',
  mysore: 'Mysuru',
  mysuru: 'Mysuru',
  hampi: 'Hampi',
};

const CITY_COORDINATES = {
  'New Delhi': { lat: 28.6139, lng: 77.209 },
  Agra: { lat: 27.1767, lng: 78.0081 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Amritsar: { lat: 31.634, lng: 74.8723 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Rishikesh: { lat: 30.0869, lng: 78.2676 },
  Srinagar: { lat: 34.0837, lng: 74.7973 },
  Mysuru: { lat: 12.2958, lng: 76.6394 },
  Hampi: { lat: 15.335, lng: 76.46 },
};

export function normalizeCity(name) {
  const key = String(name || '').trim().toLowerCase();
  return CITY_ALIASES[key] || String(name || '').trim();
}

export function cityCoordinates(city) {
  return CITY_COORDINATES[normalizeCity(city)] || null;
}

function daysBetween(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const days = Math.round((end - start) / 86400000) + 1;
  return Math.max(1, days);
}

/* ------------------------- output schema (zod) --------------------------- */
const itineraryItemSchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().optional(),
  place: z.string().min(1).max(120),
  category: z.string().max(40).optional(),
  duration: z.string().max(20).optional(),
  distance: z.string().max(20).optional(),
  transport: z.enum(['walk', 'auto', 'taxi', 'train', 'bus', 'metro']).optional(),
  cost: z.number().min(0).optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  notes: z.string().max(240).optional(),
});

const daySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().max(80).optional(),
  summary: z.string().max(240).optional(),
  items: z.array(itineraryItemSchema).min(1),
});

const tripOutputSchema = z.object({
  title: z.string().max(100),
  origin: z.string().max(80),
  destination: z.string().max(80),
  overview: z.string().max(600),
  budgetBreakdown: z.object({
    transport: z.number().min(0),
    hotel: z.number().min(0),
    food: z.number().min(0),
    activities: z.number().min(0),
    other: z.number().min(0),
  }),
  hotels: z.array(z.unknown()).max(6).optional(),
  transport: z.array(z.unknown()).max(6).optional(),
  itinerary: z.array(daySchema).min(1).max(14),
});

/* ------------------------------ parse JSON ------------------------------ */
function extractJSON(text) {
  const cleaned = text.replace(/```(?:json)?/gi, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object in AI response');
  return JSON.parse(cleaned.slice(start, end + 1));
}

/* --------------------------- deterministic planner ----------------------- */
function transportModeForDistance(meters) {
  if (meters < 1500) return 'walk';
  if (meters < 8000) return 'auto';
  return 'taxi';
}

function pickPlaces(city, interests, count, excludeIds = []) {
  const inCity = placesProvider.search({ city, limit: 100 }).items;
  let pool = inCity.filter((p) => !excludeIds.includes(p.id));

  const scored = pool.map((p) => {
    let score = p.rating + (p.popular ? 0.6 : 0);
    for (const i of interests || []) {
      if (p.category === i || p.categories.includes(i)) score += 4;
    }
    return { ...p, _score: score };
  });
  scored.sort((a, b) => b._score - a._score);

  let picked = scored.slice(0, count);
  // Top up from all-India if the city has too few matches.
  if (picked.length < count) {
    const extras = placesProvider
      .recommended({ interests, limit: 20 })
      .filter((p) => !excludeIds.includes(p.id) && !picked.some((x) => x.id === p.id))
      .slice(0, count - picked.length);
    picked = picked.concat(extras);
  }
  return picked;
}

function estimateBudget({ budget, days, travelers, stayPreference, city, corridor }) {
  const totalTravelers = (travelers?.adults || 1) + (travelers?.children || 0);
  const rooms = Math.max(1, Math.ceil(totalTravelers / 2));

  let hotel = hotelsProvider.recommended({ city, stayPreference, limit: 6 })[0];
  let hotelCost = hotel ? hotel.pricePerNight * rooms * Math.max(1, days - 1) : 1500 * Math.max(1, days - 1);
  if (!hotel || hotelCost > budget * 0.55) {
    hotel = hotelsProvider.byCategory('budget')[0] || hotel;
    hotelCost = hotel ? hotel.pricePerNight * rooms * Math.max(1, days - 1) : 1500 * Math.max(1, days - 1);
  }

  const isLocal = corridor.distanceMeters < 30000;
  const transportCost = isLocal
    ? 250 * days * Math.min(totalTravelers, 2)
    : corridor.trainFare
      ? corridor.trainFare * totalTravelers
      : 600 * totalTravelers;

  const activitiesCost = 250 * totalTravelers * days;
  const foodCost = 380 * totalTravelers * days;

  let total = hotelCost + transportCost + activitiesCost + foodCost;
  if (total > budget) {
    // scale down non-hotel categories proportionally
    const scale = Math.max(0.3, (budget - hotelCost * 0.6) / (transportCost + activitiesCost + foodCost));
    const transport = Math.round(transportCost * scale);
    const activities = Math.round(activitiesCost * scale);
    const food = Math.round(foodCost * scale);
    const other = Math.max(0, budget - hotelCost - transport - activities - food);
    return {
      transport, hotel: Math.round(hotelCost), food, activities, other,
      total: transport + Math.round(hotelCost) + food + activities + other,
      hotelPicked: hotel,
    };
  }

  const other = Math.max(0, budget - total);
  return {
    transport: Math.round(transportCost),
    hotel: Math.round(hotelCost),
    food: Math.round(foodCost),
    activities: Math.round(activitiesCost),
    other: Math.round(other),
    total: total + other,
    hotelPicked: hotel,
  };
}

function fallbackPlanner(input) {
  const destination = normalizeCity(input.destination);
  const origin = normalizeCity(input.origin || 'Delhi');
  const days = daysBetween(input.startDate, input.endDate) || input.durationDays || 2;
  const interests = input.interests?.length ? input.interests : ['historical', 'nature'];
  const stayPreference = input.stayPreference || 'medium';

  const originCoord = cityCoordinates(origin) || CITY_COORDINATES['New Delhi'];
  const destCoord = cityCoordinates(destination) || { lat: originCoord.lat + 1, lng: originCoord.lng + 1 };
  const corridorMeters = Math.round(haversineMeters(originCoord.lat, originCoord.lng, destCoord.lat, destCoord.lng));
  const isLocal = corridorMeters < 30000;

  const train = transportProvider.searchTrains({ from: origin, to: destination }).items[0] || null;
  const bus = transportProvider.searchBuses({ from: origin, to: destination }).items[0] || null;

  // Choose the day's places (roughly 3–4 per day).
  const placesPerDay = 4;
  const exclude = [];
  const itinerary = [];

  for (let d = 1; d <= days; d += 1) {
    const picked = pickPlaces(destination, interests, placesPerDay, exclude);
    picked.forEach((p) => exclude.push(p.id));

    const items = [];
    let currentCoord = destCoord;
    const baseHour = d === 1 ? 9 : 8;

    // Breakfast
    items.push({
      time: pad2(baseHour - 1), endTime: pad2(baseHour), place: 'Breakfast',
      category: 'food', duration: '1h', distance: '—', transport: 'walk', cost: 0,
      priority: 'low', notes: 'Local breakfast — ask your host for a recommendation.',
      coordinates: null, imageSlug: 'delhi',
    });

    picked.forEach((p, idx) => {
      const meters = p.coordinates
        ? haversineMeters(currentCoord.lat, currentCoord.lng, p.coordinates.lat, p.coordinates.lng)
        : 2500;
      const start = baseHour + idx * 2 + (idx > 0 ? 1 : 0);
      const durationH = Math.max(1, Math.round((p.visitDurationMin || 90) / 60));
      items.push({
        time: pad2(start), endTime: pad2(start + durationH), place: p.name,
        category: p.category, duration: formatDurationMinutes(p.visitDurationMin || 90),
        distance: p.coordinates ? formatKm(meters) : '—',
        transport: transportModeForDistance(meters),
        cost: p.entryFee || 0, priority: idx === 0 ? 'high' : 'medium',
        notes: p.bestTime ? `Best time: ${p.bestTime}.` : undefined,
        coordinates: p.coordinates || null, imageSlug: p.imageSlug,
      });
      if (p.coordinates) currentCoord = p.coordinates;
    });

    // Lunch / dinner slots
    items.push({
      time: pad2(baseHour + picked.length * 2 + 1), endTime: pad2(baseHour + picked.length * 2 + 2),
      place: d === days ? 'Dinner before heading back' : 'Lunch', category: 'food',
      duration: '1h', distance: '—', transport: 'walk', cost: 0, priority: 'medium',
      notes: undefined, coordinates: null, imageSlug: 'delhi',
    });

    itinerary.push({
      day: d,
      title: d === 1 ? `Arrival & ${picked[0]?.name || 'the highlights'}` : `Exploring ${destination}`,
      summary: picked.map((p) => p.name).slice(0, 3).join(', ') + (picked.length > 3 ? ' + more' : ''),
      items,
    });
  }

  const budget = estimateBudget({
    budget: input.budget || 5000, days, travelers: input.travelers,
    stayPreference, city: destination,
    corridor: { distanceMeters: corridorMeters, trainFare: train?.fare },
  });

  const hotels = hotelsProvider.recommended({ city: destination, stayPreference, limit: 3 });
  const transportOptions = isLocal
    ? transportProvider.localModes().map((m) => ({ mode: 'local', label: m.name, duration: '—', fare: m.costPerKm, note: m.note }))
    : [
        ...(train ? [{ mode: 'train', label: train.name, duration: formatDurationMinutes(train.durationMin), fare: train.fare, note: 'Estimate — verify on IRCTC' }] : []),
        ...(bus ? [{ mode: 'bus', label: bus.operator, duration: formatDurationMinutes(bus.durationMin), fare: bus.fare, note: 'Estimate' }] : []),
        { mode: 'car', label: 'Cab / Drive', duration: formatDurationMinutes(Math.round(corridorMeters / 1000)), fare: Math.max(800, Math.round((corridorMeters / 1000) * 9)), note: 'Estimate' },
      ];

  return {
    title: isLocal ? `${destination} city exploration` : `${origin} → ${destination}`,
    origin, destination,
    startDate: input.startDate || null,
    endDate: input.endDate || null,
    durationDays: days,
    travelers: input.travelers || { adults: 1, children: 0 },
    budget: input.budget || 5000,
    travelStyle: input.travelStyle || 'comfort',
    transportPreference: input.transportPreference || 'any',
    stayPreference,
    interests,
    status: 'planned',
    overview: `A ${days}-day${isLocal ? ' local' : ''} trip to ${destination} with ${interests.slice(0, 3).join(', ')} highlights, planned to fit a ₹${(input.budget || 5000).toLocaleString('en-IN')} budget. All prices and schedules are estimates.`,
    itinerary,
    hotels,
    transport: transportOptions,
    budgetBreakdown: {
      transport: budget.transport, hotel: budget.hotel, food: budget.food,
      activities: budget.activities, other: budget.other,
    },
    totalEstimate: budget.total,
    ai: { model: 'demo-planner', generated: true, disclaimer: 'AI-generated itinerary — all prices and timings are estimates.' },
  };
}

function pad2(n) {
  return `${String(Math.max(0, n % 24)).padStart(2, '0')}:00`;
}

/* ------------------------------ trip generate ---------------------------- */
export async function generateTrip(input) {
  // Try Gemini when a key is configured; fall back to the deterministic planner.
  if (geminiProvider.available()) {
    try {
      const prompt = buildTripPlannerPrompt(input);
      const { text } = await geminiProvider.generateJSON(prompt);
      const parsed = tripOutputSchema.parse(extractJSON(text));
      return normalizeGeminiTrip(parsed, input);
    } catch (err) {
      logger.warn('[ai] Gemini trip generation failed, using demo planner:', err.message);
    }
  }
  return fallbackPlanner(input);
}

function normalizeGeminiTrip(parsed, input) {
  const budgetBreakdown = {
    transport: parsed.budgetBreakdown.transport || 0,
    hotel: parsed.budgetBreakdown.hotel || 0,
    food: parsed.budgetBreakdown.food || 0,
    activities: parsed.budgetBreakdown.activities || 0,
    other: parsed.budgetBreakdown.other || 0,
  };
  return {
    title: parsed.title,
    origin: parsed.origin || input.origin || 'Delhi',
    destination: parsed.destination || input.destination,
    startDate: input.startDate || null,
    endDate: input.endDate || null,
    durationDays: parsed.itinerary.length,
    travelers: input.travelers || { adults: 1, children: 0 },
    budget: input.budget,
    travelStyle: input.travelStyle || 'comfort',
    transportPreference: input.transportPreference || 'any',
    stayPreference: input.stayPreference || 'medium',
    interests: input.interests || [],
    status: 'planned',
    overview: parsed.overview,
    itinerary: parsed.itinerary.map((d, di) => ({
      id: `day_${di + 1}_${Date.now()}`,
      day: d.day,
      title: d.title || `Day ${d.day}`,
      summary: d.summary || '',
      items: d.items.map((it, ii) => ({
        id: `itm_${Date.now()}_${ii}`,
        ...it,
        coordinates: null,
        imageSlug: null,
        notes: it.notes ? `${it.notes} (estimate)` : 'Estimate',
      })),
    })),
    hotels: parsed.hotels || [],
    transport: parsed.transport || [],
    budgetBreakdown,
    totalEstimate: Object.values(budgetBreakdown).reduce((a, b) => a + b, 0),
    ai: { model: geminiProvider.modelName(), generated: true, disclaimer: 'AI-generated itinerary — all prices and timings are estimates.' },
  };
}

/* ------------------------------ natural language ------------------------- */
export function parseNaturalLanguage(text) {
  const t = String(text || '').toLowerCase();

  const budgetMatch = t.match(/(?:budget|₹|rs\.?|rupaye)\s*:?\s*([\d,.]+)/) || t.match(/([\d,]+)\s*(?:rupees|rs|₹|budget)/);
  const daysMatch = t.match(/(\d+)\s*(?:din|day|days|dino)/);
  const travelersMatch = t.match(/(\d+)\s*(?:people|person|log|logon|travelers|travellers|adults)/);

  const CITY = ['agra', 'jaipur', 'new delhi', 'delhi', 'varanasi', 'banaras', 'amritsar', 'mumbai', 'rishikesh', 'srinagar', 'mysore', 'hampi'];
  // Resolve origin/destination by the order cities appear in the sentence
  // ("Delhi se Agra" → origin Delhi, destination Agra).
  const matches = [];
  for (const c of CITY) {
    const idx = t.indexOf(c);
    if (idx !== -1) matches.push({ city: c, idx });
  }
  matches.sort((a, b) => a.idx - b.idx);
  const destination = normalizeCity(matches[matches.length - 1]?.city || '');
  const origin = normalizeCity(matches[0]?.city || 'Delhi');
  const sameCity = matches.length <= 1;

  const interests = [];
  const interestMap = [
    ['temple', ['temple', 'mandir', 'mandiron']],
    ['gurudwara', ['gurudwara', 'gurdwara', 'gurudware']],
    ['historical', ['historical', 'monument', 'taj', 'fort', 'qila', 'itihaasik']],
    ['nature', ['nature', 'prakriti', 'garden', 'lake', 'jheel', 'park']],
    ['food', ['food', 'khana', 'street food', 'chaat', 'parantha']],
    ['adventure', ['adventure', 'trek', 'rafting', 'hiking']],
    ['shopping', ['shopping', 'market', 'bazaar', 'bazar']],
    ['spiritual', ['spiritual', 'darshan', 'aarti']],
    ['family', ['family', 'parivaar', 'family trip']],
  ];
  for (const [cat, keys] of interestMap) {
    if (keys.some((k) => t.includes(k))) interests.push(cat);
  }

  let transportPreference = 'any';
  if (/(train|rail|shatabdi)/.test(t)) transportPreference = 'train';
  else if (/(bus|volvo)/.test(t)) transportPreference = 'bus';
  else if (/(car|taxi|cab|drive)/.test(t)) transportPreference = 'car';
  else if (/(walk|paidal|walking)/.test(t)) transportPreference = 'walking';

  let stayPreference = 'medium';
  if (/(budget hotel|sasta hotel|cheap)/.test(t)) stayPreference = 'budget';
  else if (/(premium|luxury|5 ?star|acha hotel|best hotel)/.test(t)) stayPreference = 'premium';

  return {
    origin: sameCity ? destination : origin,
    destination: destination || 'Agra',
    durationDays: daysMatch ? Number(daysMatch[1]) : undefined,
    budget: budgetMatch ? Number(budgetMatch[1].replace(/[,\s]/g, '')) : undefined,
    travelers: travelersMatch ? { adults: Number(travelersMatch[1]), children: 0 } : undefined,
    interests,
    transportPreference,
    stayPreference,
  };
}

/* -------------------------------- assistant ------------------------------ */
export async function chat({ message, trip, preferences, history = [] }) {
  if (geminiProvider.available()) {
    try {
      const prompt = buildAssistantPrompt({ message, context: { trip, preferences } });
      const reply = await geminiProvider.chat(prompt);
      return { role: 'assistant', content: reply, kind: 'text', data: null };
    } catch (err) {
      logger.warn('[ai] Gemini chat failed, using rule-based assistant:', err.message);
    }
  }
  return ruleBasedReply({ message, trip, preferences });
}

function ruleBasedReply({ message, trip }) {
  const m = String(message || '').toLowerCase();

  if (/(budget kam|reduce cost|sasta|cheaper|kam karo|3500|3000|2000)/.test(m)) {
    const total = trip?.budget || 5000;
    const reduced = Math.round(total * 0.72);
    return {
      role: 'assistant', kind: 'budget',
      content: `I can bring your trip down to about ₹${reduced.toLocaleString('en-IN')}. I'd swap to a budget stay, cut one taxi leg for an auto-rickshaw, and replace paid activities with free ones — while keeping ${trip?.itinerary?.[0]?.items?.[2]?.place || 'your top highlight'}. Want me to apply this?`,
      data: { before: total, after: reduced, action: 'budget-optimize' },
    };
  }

  if (/(late|der ho|der ho gayi|missed|miss ho)/.test(m)) {
    return {
      role: 'assistant', kind: 'text',
      content: 'No problem — let me re-plan. I\'ll drop the activities you can\'t make, keep the high-priority ones, and shift the rest forward. What happened — running late, missed transport, or want fewer stops?',
      data: { action: 'replan' },
    };
  }

  if (/(nearby|paas|aas paas|near me|gurudwara|mandir|temple)/.test(m)) {
    const city = trip?.destination || 'Agra';
    const category = /gurudwara/.test(m) ? 'gurudwara' : /temple|mandir/.test(m) ? 'temple' : null;
    const results = placesProvider.search({ city, category, limit: 3 }).items;
    if (results.length) {
      const names = results.map((p) => `• ${p.name} (${p.category}, ${p.rating}★)`).join('\n');
      return {
        role: 'assistant', kind: 'place',
        content: `Here are some ${category || 'top'} places near ${city}:\n${names}\n\nAll distances are estimates.`,
        data: { places: results.slice(0, 3), action: 'show-places' },
      };
    }
    return { role: 'assistant', kind: 'text', content: `I couldn't find verified ${category || 'nearby'} places for ${city} in my catalog yet.` };
  }

  if (/(hotel|stay|room)/.test(m)) {
    const hotels = hotelsProvider.recommended({ city: trip?.destination || 'Agra', stayPreference: trip?.stayPreference || 'medium', limit: 3 });
    const lines = hotels.map((h) => `• ${h.name} — ₹${h.pricePerNight}/night, ${h.rating}★`).join('\n');
    return {
      role: 'assistant', kind: 'hotel',
      content: `Here are my top stays for ${trip?.destination || 'Agra'}:\n${lines}\n\nPrices are estimates.`,
      data: { hotels: hotels.slice(0, 3), action: 'show-hotels' },
    };
  }

  if (/(walk|paidal|walking|pedestrian)/.test(m)) {
    const dest = trip?.itinerary?.[0]?.items?.find((i) => i.coordinates);
    const origin = CITY_COORDINATES['New Delhi'];
    const route = mapsProvider.planRoute({ mode: 'walking', origin, destination: dest?.coordinates || { lat: 27.1751, lng: 78.0421 } });
    return {
      role: 'assistant', kind: 'route',
      content: `A walking route is about ${formatKm(route.distanceMeters)} (≈ ${formatDurationMinutes(route.durationMinutes)} at a steady pace). It's an estimate — real distance depends on the exact path.`,
      data: { route, action: 'walking-route' },
    };
  }

  if (/(kitna door|distance|door kitni|dur)/.test(m)) {
    const next = trip?.itinerary?.[0]?.items?.[2];
    return {
      role: 'assistant', kind: 'text',
      content: next ? `Your next stop is ${next.place}. Distances between stops are estimates until you start live tracking — turn on Live Trip mode for accurate distance and ETA.` : 'Start your trip to see live distances and ETAs.',
    };
  }

  if (/(total|kharcha|cost|expense|kharche|budget)/.test(m)) {
    const b = trip?.budgetBreakdown || {};
    const lines = Object.entries(b).map(([k, v]) => `• ${k}: ₹${Number(v).toLocaleString('en-IN')}`).join('\n');
    return {
      role: 'assistant', kind: 'budget',
      content: `Your planned budget for ${trip?.title || 'this trip'} is ₹${Number(trip?.budget || 0).toLocaleString('en-IN')}.\n${lines}`,
      data: { breakdown: b },
    };
  }

  if (/(train|rail)/.test(m)) {
    const tr = transportProvider.searchTrains({ from: 'New Delhi', to: trip?.destination || 'Agra' }).items[0];
    return {
      role: 'assistant', kind: 'text',
      content: tr ? `The ${tr.name} (${tr.number}) is a popular option — departs ${tr.departure}, arrives ${tr.arrival}, fare around ₹${tr.fare}. This is an estimate; verify on IRCTC before booking.` : 'I don\'t have a verified train schedule for that route yet.',
    };
  }

  return {
    role: 'assistant', kind: 'text',
    content: 'I can help you optimize your trip, find nearby temples & gurudwaras, cut your budget, re-plan if you\'re late, or find hotels and trains. Try "budget kam karo", "paas mein gurudwara", or "I\'m late".',
    data: { action: 'help' },
  };
}
