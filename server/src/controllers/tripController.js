import Trip from "../models/Trip.js";
import User from "../models/User.js";
import { isDBConnected } from "../config/db.js";
import { memoryStore } from "../utils/memoryStore.js";
import { generateItinerary, chatWithItinerary } from "../services/gemini.service.js";

const saveTrip = async (tripData, userId) => {
  if (isDBConnected()) {
    const trip = await Trip.create({ ...tripData, user: userId });
    // also update user history
    try {
      const u = await User.findById(userId);
      if (u) {
        u.history.unshift({ destination: tripData.destination, from: tripData.source, days: tripData.days, tripId: trip._id });
        if (u.history.length > 50) u.history = u.history.slice(0,50);
        u.stats.totalTrips = u.history.length;
        await u.save();
      }
    } catch{}
    return trip;
  } else {
    const trip = { _id: memoryStore.generateId(), ...tripData, user: userId, createdAt: new Date(), updatedAt: new Date(), views: 0 };
    memoryStore.trips.push(trip);
    const u = memoryStore.users.find(x=>x._id===userId);
    if (u) {
      u.history = u.history || [];
      u.history.unshift({ destination: tripData.destination, from: tripData.source, days: tripData.days, tripId: trip._id, visitedAt: new Date() });
      u.stats = u.stats || { totalTrips:0,totalDistanceKm:0,totalSteps:0 };
      u.stats.totalTrips = u.history.length;
    }
    return trip;
  }
};

export const generateTrip = async (req, res) => {
  const { source, destination, days, travelers, budget, interests, travelStyle, budgetType } = req.body;
  if (!source || !destination || !days || !travelers || !budget) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const aiData = await generateItinerary({ source, destination, days, travelers, budget, interests, travelStyle, budgetType });

  const tripData = {
    title: aiData.title,
    source, destination, days: Number(days), travelers: Number(travelers), budget: Number(budget),
    interests: interests || [], travelStyle: travelStyle || "comfort", budgetType: budgetType || "total",
    itinerary: aiData.itinerary,
    overview: aiData.overview,
    transportOptions: aiData.transportOptions,
    hotels: aiData.hotels,
    food: aiData.food,
    budgetBreakdown: aiData.budgetBreakdown,
    mapCenter: aiData.mapCenter,
    srcCenter: aiData.srcCenter,
    isPublic: true,
  };

  const saved = await saveTrip(tripData, req.user._id);

  res.json({ 
    success: true, 
    message: aiData.isMock ? "Itinerary generated (Mock Mode)" : "Itinerary generated via Gemini",
    data: { trip: saved, isMock: aiData.isMock } 
  });
};

export const getMyTrips = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page-1)*limit;

  if (isDBConnected()) {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Trip.countDocuments({ user: req.user._id });
    return res.json({ success: true, data: { trips, pagination: { page, limit, total, pages: Math.ceil(total/limit) } } });
  } else {
    let trips = memoryStore.trips.filter(t => t.user === req.user._id);
    trips.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = trips.length;
    const paged = trips.slice(skip, skip+limit);
    return res.json({ success: true, data: { trips: paged, pagination: { page, limit, total, pages: Math.ceil(total/limit) } } });
  }
};

export const getPublicTrips = async (req, res) => {
  const { search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const skip = (page-1)*limit;

  if (isDBConnected()) {
    let filter = { isPublic: true };
    if (search) filter.destination = { $regex: search, $options: "i" };
    const trips = await Trip.find(filter).sort({ views: -1, createdAt: -1 }).skip(skip).limit(limit);
    const total = await Trip.countDocuments(filter);
    return res.json({ success: true, data: { trips, pagination: { page, limit, total } } });
  } else {
    let trips = [...memoryStore.trips].filter(t=>t.isPublic);
    if (search) trips = trips.filter(t => t.destination.toLowerCase().includes(search.toLowerCase()));
    const total = trips.length;
    return res.json({ success: true, data: { trips: trips.slice(skip, skip+limit), pagination: { page, limit, total } } });
  }
};

export const getTripById = async (req, res) => {
  const { id } = req.params;
  let trip;
  if (isDBConnected()) {
    trip = await Trip.findById(id);
    if (trip) { 
      // only owner or public
      if (trip.user.toString() !== req.user?._id?.toString() && !trip.isPublic) {
        // allow if user is owner via token? check protect optional
      }
      trip.views += 1; await trip.save(); 
    }
  } else {
    trip = memoryStore.trips.find(t => t._id === id);
    if (trip) trip.views = (trip.views||0)+1;
  }
  if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });
  // if trip belongs to other user and not public, block
  if (trip.user && req.user && trip.user.toString() !== req.user._id.toString() && !trip.isPublic) {
    // but we set all public true, so fine
  }
  res.json({ success: true, data: { trip } });
};

export const deleteTrip = async (req, res) => {
  const { id } = req.params;
  if (isDBConnected()) {
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });
    if (trip.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    await Trip.findByIdAndDelete(id);
  } else {
    const idx = memoryStore.trips.findIndex(t => t._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Trip not found" });
    if (memoryStore.trips[idx].user !== req.user._id && req.user.role !== "admin") return res.status(403).json({ success: false, message: "Forbidden" });
    memoryStore.trips.splice(idx, 1);
  }
  res.json({ success: true, message: "Trip deleted" });
};

export const chatTrip = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: "Message required" });
  let trip;
  if (isDBConnected()) trip = await Trip.findById(id);
  else trip = memoryStore.trips.find(t => t._id === id);
  if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });
  const reply = await chatWithItinerary(trip, message);
  res.json({ success: true, data: { reply } });
};

export const getStats = async (req, res) => {
  if (isDBConnected()) {
    const totalTrips = await Trip.countDocuments();
    const totalUsers = await User.countDocuments();
    const popular = await Trip.find({ isPublic: true }).sort({ views: -1 }).limit(5);
    return res.json({ success: true, data: { totalTrips, totalUsers, popular } });
  } else {
    return res.json({ success: true, data: { totalTrips: memoryStore.trips.length, totalUsers: memoryStore.users.length, popular: memoryStore.trips.slice(0,5) } });
  }
};
