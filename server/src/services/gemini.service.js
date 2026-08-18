import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env.js";

// Mock data generator for when no API key
const getMockItinerary = ({ source, destination, days, travelers, budget, interests, travelStyle }) => {
  const dest = destination || "Manali";
  const src = source || "Delhi";
  const budgetNum = Number(budget) || 15000;
  const daysNum = Number(days) || 3;
  const interestsArr = interests?.length ? interests : ["nature", "food", "culture"];
  
  // Destination coordinates map
  const coords = {
    "manali": { lat: 32.2396, lng: 77.1887 },
    "goa": { lat: 15.2993, lng: 74.124 },
    "jaipur": { lat: 26.9124, lng: 75.7873 },
    "kerala": { lat: 10.8505, lng: 76.2711 },
    "leh ladakh": { lat: 34.152588, lng: 77.57705 },
    "varanasi": { lat: 25.3176, lng: 82.9739 },
    "udaipur": { lat: 24.5854, lng: 73.7125 },
    "mumbai": { lat: 19.076, lng: 72.8777 },
    "delhi": { lat: 28.7041, lng: 77.1025 },
    "shimla": { lat: 31.1048, lng: 77.1734 },
    "rishikesh": { lat: 30.0869, lng: 78.2676 },
    "darjeeling": { lat: 27.041, lng: 88.2663 },
  };
  const key = dest.toLowerCase();
  const center = coords[key] || coords["manali"];

  const themes = ["Arrival & Local Exploration", "Adventure & Nature", "Culture & Food", "Hidden Gems & Shopping", "Sunrise & Farewell"];
  const perDayBudget = Math.round(budgetNum / daysNum);
  
  const itinerary = Array.from({ length: daysNum }, (_, i) => {
    const dayNum = i + 1;
    return {
      day: dayNum,
      title: `Day ${dayNum}: ${themes[i % themes.length]}`,
      theme: interestsArr[i % interestsArr.length],
      totalCost: `₹${Math.round(perDayBudget * 0.9)} - ₹${perDayBudget}`,
      places: [
        {
          name: dayNum === 1 ? `Journey from ${src} to ${dest}` : `${dest} - ${["Mall Road", "Temple Trail", "Lake View", "Fort Explorer", "Local Bazaar"][i % 5]}`,
          description: dayNum === 1 
            ? `Scenic journey from ${src}. Check-in and evening stroll at local market. Try local chai and explore nearby cafes.`
            : `Explore the best of ${dest} with ${interestsArr.join(", ")} focused experiences. Authentic local vibes.`,
          time: i === 0 ? "Morning" : "09:00 AM",
          duration: "3-4 hours",
          cost: `₹${300 + i*150}`,
          category: i === 0 ? "travel" : interestsArr[i % interestsArr.length],
          lat: center.lat + (Math.random()-0.5)*0.05,
          lng: center.lng + (Math.random()-0.5)*0.05,
          tips: "Start early to avoid crowds. Carry cash."
        },
        {
          name: ["Hadimba Temple", "Baga Beach", "Hawa Mahal", "Alleppey Backwaters", "Pangong Lake View", "Ganga Aarti", "City Palace", "Gateway of India"][Object.keys(coords).indexOf(key) % 8] || "Local Heritage Site",
          description: `Must-visit attraction in ${dest}. Rich history, stunning views and perfect for photos. Local guide recommended.`,
          time: "11:30 AM",
          duration: "2-3 hours",
          cost: `₹${200 + i*100}`,
          category: "sightseeing",
          lat: center.lat + (Math.random()-0.5)*0.08,
          lng: center.lng + (Math.random()-0.5)*0.08,
          tips: "Book tickets online to skip queue."
        },
        {
          name: ["Johnson's Cafe", "Fish Thali House", "LMB Sweets", "Kerala Sadya Spot", "Wanderers Cafe", "Kachori Gali", "Ambrai Ghat View"][i % 7],
          description: `Famous local food joint. Try the signature dish - absolutely loved by travelers. Budget-friendly and hygienic.`,
          time: "01:30 PM",
          duration: "1 hour",
          cost: `₹${250 + i*50} per person`,
          category: "food",
          lat: center.lat + (Math.random()-0.5)*0.03,
          lng: center.lng + (Math.random()-0.5)*0.03,
          tips: "Try the thali - best value!"
        },
        {
          name: ["Solang Valley Adventure", "Sunset Cruise", "Cultural Village Tour", "Spice Plantation", "Monastery Visit", "Boat Ride"][i % 6],
          description: `Evening experience in ${dest}. ${travelStyle === "luxury" ? "Premium curated experience with private guide." : travelStyle === "budget" ? "Budget-friendly group tour available." : "Comfortable and well-rated experience."}`,
          time: "04:00 PM",
          duration: "3 hours",
          cost: `₹${800 + i*200}`,
          category: "activity",
          lat: center.lat + (Math.random()-0.5)*0.1,
          lng: center.lng + (Math.random()-0.5)*0.1,
          tips: "Carry water and sunscreen."
        }
      ]
    };
  });

  return {
    title: `${daysNum} Days in ${dest} from ${src} ✈️`,
    itinerary,
    overview: {
      totalEstimatedCost: `₹${budgetNum - 1000} - ₹${budgetNum + 500}`,
      bestTimeToVisit: dest.toLowerCase().includes("goa") ? "Nov - Feb" : dest.toLowerCase().includes("leh") ? "May - Sep" : "Oct - Mar",
      localCuisine: dest.toLowerCase().includes("jaipur") ? ["Dal Baati Churma", "Ghewar", "Laal Maas"] : dest.toLowerCase().includes("kerala") ? ["Appam & Stew", "Karimeen Fry", "Puttu"] : ["Local Thali", "Momos", "Chai & Pakora"],
      packingTips: ["Comfortable walking shoes", "Power bank", "Sunscreen", "Light jacket for evenings"],
      transportTips: `From ${src}, best is ${daysNum > 5 ? "train + local cab" : "volvo bus / flight to nearest city + cab"}. Local auto/cab daily ₹800-1200.`
    },
    hotels: [
      { name: `The ${dest} Retreat`, area: "Near Mall Road", pricePerNight: `₹${travelStyle==="luxury"?4500:travelStyle==="budget"?900:1800}`, rating: "4.5 ★ (1.2k reviews)", why: "Best for families, central location" },
      { name: `${dest} Backpackers Hostel`, area: "Old Town", pricePerNight: `₹${travelStyle==="luxury"?3200:travelStyle==="budget"?500:1200}`, rating: "4.3 ★", why: "Budget + social vibe, great for solo travelers" },
      { name: `Luxury Escape ${dest}`, area: "Scenic View", pricePerNight: `₹${travelStyle==="luxury"?7500:travelStyle==="budget"?1500:2800}`, rating: "4.8 ★", why: "Premium stay with valley view" },
    ],
    food: [
      { dish: "Local Special Thali", where: "Market Main Street", cost: "₹250" },
      { dish: "Street Momos & Chai", where: "Mall Road stalls", cost: "₹120" },
      { dish: "Wood-fired Pizza / Cafe Food", where: "German Bakery Lane", cost: "₹400" },
    ],
    budgetBreakdown: {
      stay: `₹${Math.round(budgetNum*0.35)}`,
      food: `₹${Math.round(budgetNum*0.25)}`,
      transport: `₹${Math.round(budgetNum*0.25)}`,
      activities: `₹${Math.round(budgetNum*0.15)}`,
      total: `₹${budgetNum}`
    },
    mapCenter: center
  };
};

export const generateItinerary = async (params) => {
  const { source, destination, days, travelers, budget, interests, travelStyle, budgetType } = params;

  // If no Gemini key, return mock instantly
  if (!config.geminiKey) {
    console.log("🤖 No GEMINI_API_KEY, using MOCK itinerary");
    await new Promise(r => setTimeout(r, 1800)); // simulate AI delay
    return { ...getMockItinerary(params), isMock: true };
  }

  try {
    const genAI = new GoogleGenerativeAI(config.geminiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const totalBudget = budgetType === "per_person" ? Number(budget) * Number(travelers) : Number(budget);

    const prompt = `
You are YatraGenie AI, India's best trip planner. Create a detailed itinerary.

INPUT:
- Source: ${source}
- Destination: ${destination}
- Days: ${days}
- Travelers: ${travelers}
- Total Budget: ₹${totalBudget} (${travelStyle} style)
- Interests: ${interests?.join(", ") || "general"}
- Destination is in India.

STRICT JSON FORMAT REQUIRED:
{
  "title": "string (e.g. 3 Days in Goa from Delhi)",
  "itinerary": [
    {
      "day": 1,
      "title": "string",
      "theme": "string",
      "totalCost": "₹X - ₹Y",
      "places": [
        {
          "name": "string",
          "description": "string (2 lines, engaging)",
          "time": "string (e.g. 09:00 AM)",
          "duration": "string (e.g. 2 hours)",
          "cost": "₹X",
          "category": "sightseeing|food|activity|travel|stay",
          "lat": number (approx lat of destination),
          "lng": number (approx lng),
          "tips": "string (1 pro tip)"
        }
      ]
    }
  ],
  "overview": {
    "totalEstimatedCost": "₹X - ₹Y",
    "bestTimeToVisit": "string",
    "localCuisine": ["dish1","dish2","dish3"],
    "packingTips": ["tip1","tip2"],
    "transportTips": "string"
  },
  "hotels": [
    { "name": "string", "area": "string", "pricePerNight": "₹X", "rating": "4.x ★", "why": "string" }
  ],
  "food": [
    { "dish": "string", "where": "string", "cost": "₹X" }
  ],
  "budgetBreakdown": {
    "stay": "₹X",
    "food": "₹X",
    "transport": "₹X",
    "activities": "₹X",
    "total": "₹X"
  },
  "mapCenter": { "lat": number, "lng": number }
}

RULES:
- Each day must have 4 places.
- lat/lng must be realistic for ${destination}, India. Keep all places within 0.1 degree of mapCenter.
- Budget breakdown must sum roughly to ₹${totalBudget}.
- Hotels: 3 options (budget, mid, luxury adapted to ${travelStyle})
- Food: 3 local dishes
- Cost all in INR (₹)
- Be culturally accurate for India.
- Return ONLY JSON, no markdown.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    
    // Ensure mapCenter fallback
    if (!parsed.mapCenter || !parsed.mapCenter.lat) {
      const mock = getMockItinerary(params);
      parsed.mapCenter = mock.mapCenter;
    }
    // Ensure every place has lat/lng
    parsed.itinerary.forEach(day => {
      day.places.forEach(p => {
        if (!p.lat || !p.lng) {
          p.lat = parsed.mapCenter.lat + (Math.random()-0.5)*0.05;
          p.lng = parsed.mapCenter.lng + (Math.random()-0.5)*0.05;
        }
      });
    });

    return { ...parsed, isMock: false };
  } catch (err) {
    console.error("Gemini error:", err.message);
    // Fallback to mock on any error
    return { ...getMockItinerary(params), isMock: true, geminiError: err.message };
  }
};

// For chat with itinerary
export const chatWithItinerary = async (trip, userMessage) => {
  if (!config.geminiKey) {
    return `Mock AI: For your trip to ${trip.destination}, "${userMessage}" - I recommend checking local markets in the evening! (Add GEMINI_API_KEY for real AI chat)`;
  }
  try {
    const genAI = new GoogleGenerativeAI(config.geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are YatraGenie AI assistant for a trip: ${JSON.stringify(trip).slice(0,3000)}.\nUser question: ${userMessage}\nAnswer in Hinglish-friendly, helpful tone, concise (under 120 words), INR costs.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    return "Sorry, AI is busy. Please try again. (Check GEMINI_API_KEY)";
  }
};
