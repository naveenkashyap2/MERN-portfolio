/**
 * Seed MongoDB with catalog places/stays and a demo user.
 * Requires MONGODB_URI and USE_IN_MEMORY_DB=false
 *
 *   cd server && node src/scripts/seed.js
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

process.env.USE_IN_MEMORY_DB = 'false';
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/yatragenie';
}

const mongoose = require('mongoose');
const { hashPassword } = require('../utils/password');
const User = require('../models/User');
const Trip = require('../models/Trip');
const { PLACES, STAY_AREAS, CITIES } = require('../data/indiaCatalog');
const { buildTemplatePlan } = require('../services/templatePlanner');

const PlaceCache = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    name: String,
    city: String,
    state: String,
    category: String,
    lat: Number,
    lng: Number,
    rating: Number,
    durationMin: Number,
    entryFee: Number,
    bestTime: String,
    description: String,
    trust: { type: String, default: 'CATALOG' },
  },
  { collection: 'place_catalog', strict: true }
);

const HotelCache = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    name: String,
    city: String,
    category: String,
    area: String,
    estimatedPrice: Number,
    amenities: [String],
    notes: String,
    trust: { type: String, default: 'CATALOG' },
    availabilityStatus: { type: String, default: 'unverified' },
  },
  { collection: 'hotel_catalog', strict: true }
);

async function run() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting', uri.replace(/\/\/.*@/, '//***@'));
  await mongoose.connect(uri);

  const Place = mongoose.models.PlaceCacheSeed || mongoose.model('PlaceCacheSeed', PlaceCache);
  const Hotel = mongoose.models.HotelCacheSeed || mongoose.model('HotelCacheSeed', HotelCache);

  await Place.deleteMany({});
  await Hotel.deleteMany({});
  await Place.insertMany(PLACES.map((p) => ({ ...p, trust: 'CATALOG' })));
  await Hotel.insertMany(
    STAY_AREAS.map((h) => ({
      ...h,
      trust: 'CATALOG',
      availabilityStatus: 'unverified',
    }))
  );

  let user = await User.findOne({ email: 'demo@yatragenie.ai' }).select('+passwordHash');
  if (!user) {
    user = await User.create({
      name: 'Demo Traveler',
      email: 'demo@yatragenie.ai',
      passwordHash: await hashPassword('Travel@123'),
      role: 'user',
      isEmailVerified: true,
      onboardingCompleted: true,
      preferences: {
        preferredTransport: 'train',
        preferredHotel: 'medium',
        interests: ['historical', 'temple', 'food'],
      },
    });
    console.log('Created demo user demo@yatragenie.ai / Travel@123');
  } else {
    console.log('Demo user already exists');
  }

  const existing = await Trip.findOne({ userId: user._id, title: 'Delhi → Agra' });
  if (!existing) {
    const start = new Date();
    start.setDate(start.getDate() + 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const plan = buildTemplatePlan({
      origin: 'Delhi',
      destination: 'Agra',
      durationDays: 2,
      budget: 5000,
      travelers: { adults: 2, children: 0 },
      transportPreference: 'train',
      stayPreference: 'medium',
      interests: ['historical', 'temple', 'food'],
    });
    const delhi = CITIES.find((c) => c.id === 'delhi');
    const agra = CITIES.find((c) => c.id === 'agra');
    await Trip.create({
      userId: user._id,
      title: 'Delhi → Agra',
      origin: {
        name: delhi.name,
        city: delhi.name,
        state: delhi.state,
        lat: delhi.lat,
        lng: delhi.lng,
        coordinatesVerified: true,
      },
      destination: {
        name: agra.name,
        city: agra.name,
        state: agra.state,
        lat: agra.lat,
        lng: agra.lng,
        coordinatesVerified: true,
      },
      startDate: start,
      endDate: end,
      travelers: { adults: 2, children: 0 },
      budget: 5000,
      transportPreference: 'train',
      stayPreference: 'medium',
      interests: ['historical', 'temple', 'food'],
      status: 'planned',
      itinerary: plan.itinerary,
      hotels: plan.hotels,
      transport: plan.transport,
      expensePlan: plan.expensePlan,
      aiSummary: plan.summary,
      aiSource: 'template',
    });
    console.log('Seeded Delhi → Agra demo trip');
  }

  console.log(`Places: ${await Place.countDocuments()}  Hotels: ${await Hotel.countDocuments()}`);
  await mongoose.disconnect();
  console.log('Seed complete');
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
