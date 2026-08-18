import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env.js";

// Enhanced mock with transport options, Kanpur-Delhi specials, all India
const getMockItinerary = ({ source, destination, days, travelers, budget, interests, travelStyle }) => {
  const dest = destination || "Delhi";
  const src = source || "Kanpur";
  const budgetNum = Number(budget) || 15000;
  const daysNum = Number(days) || 3;
  const interestsArr = interests?.length ? interests : ["nature", "food", "culture"];
  
  const coords = {
    "kanpur": { lat: 26.4499, lng: 80.3319 },
    "delhi": { lat: 28.7041, lng: 77.1025 },
    "lucknow": { lat: 26.8467, lng: 80.9462 },
    "varanasi": { lat: 25.3176, lng: 82.9739 },
    "allahabad": { lat: 25.4358, lng: 81.8463 },
    "prayagraj": { lat: 25.4358, lng: 81.8463 },
    "manali": { lat: 32.2396, lng: 77.1887 },
    "goa": { lat: 15.2993, lng: 74.124 },
    "jaipur": { lat: 26.9124, lng: 75.7873 },
    "kerala": { lat: 10.8505, lng: 76.2711 },
    "leh ladakh": { lat: 34.1526, lng: 77.577 },
    "udaipur": { lat: 24.5854, lng: 73.7125 },
    "mumbai": { lat: 19.076, lng: 72.8777 },
    "shimla": { lat: 31.1048, lng: 77.1734 },
    "rishikesh": { lat: 30.0869, lng: 78.2676 },
    "darjeeling": { lat: 27.041, lng: 88.2663 },
    "agra": { lat: 27.1767, lng: 78.0081 },
    "ayodhya": { lat: 26.7922, lng: 82.1998 },
    "mathura": { lat: 27.4924, lng: 77.6737 },
    "amritsar": { lat: 31.634, lng: 74.8723 },
    "kolkata": { lat: 22.5726, lng: 88.3639 },
    "chennai": { lat: 13.0827, lng: 80.2707 },
    "hyderabad": { lat: 17.385, lng: 78.4867 },
    "bangalore": { lat: 12.9716, lng: 77.5946 },
    "bengaluru": { lat: 12.9716, lng: 77.5946 },
    "pune": { lat: 18.5204, lng: 73.8567 },
    "ahmedabad": { lat: 23.0225, lng: 72.5714 },
  };
  const key = dest.toLowerCase();
  const srcKey = src.toLowerCase();
  const center = coords[key] || coords["delhi"];
  const srcCenter = coords[srcKey] || coords["kanpur"];

  // Special Kanpur -> Delhi transport
  const isKanpurDelhi = (srcKey.includes("kanpur") && key.includes("delhi")) || (srcKey.includes("delhi") && key.includes("kanpur"));
  const isUPDelhi = (["kanpur","lucknow","varanasi","allahabad","prayagraj","ayodhya","agra"].includes(srcKey) && key.includes("delhi"));

  let transportOptions;
  if (isKanpurDelhi) {
    transportOptions = {
      highway: { name: "NH 19 (Grand Trunk Road)", distance: "440 km", duration: "6h 30m via Yamuna Expressway", cost: "₹1800-2200 (cab) + Toll ₹650", best: "Sedan / Innova, dhabas at Etawah & Mathura" },
      train: {
        name: "Trains — Live Timings",
        options: [
          { name: "Shram Shakti Express (12451)", time: "23:55 → 06:10", duration: "6h 15m", price: "₹320 SL / ₹840 3A / ₹1190 2A", status: "Daily • Right time", from: "Kanpur Central (CNB)", to: "New Delhi (NDLS)" },
          { name: "Kanpur Shatabdi (12033)", time: "06:00 → 11:15", duration: "5h 15m", price: "₹540 CC / ₹1070 EC", status: "Mon-Sat • Superfast", from: "CNB", to: "NDLS" },
          { name: "Gomti Express (12419)", time: "15:45 → 22:05", duration: "6h 20m", price: "₹215 Gen / ₹385 SL", status: "Daily • Good for day", from: "CNB", to: "LKO → NDLS via ?", to: "NDLS" },
          { name: "Unchahar Express (14218)", time: "13:05 → 21:30", duration: "8h 25m", price: "₹245 SL", status: "Daily • Budget", from: "CNB", to: "NDLS" },
        ],
        recommendation: "Fastest: Shatabdi (5h 15m). Comfort: Shram Shakti overnight — save hotel.",
      },
      flight: { name: "Flight", distance: "410 km", duration: "1h 10m", cost: "₹3500-6000", note: "Kanpur (KNU) → Delhi (DEL) via Lucknow often cheaper. Or Lucknow DEL direct 1h." },
      local: { name: "Local Auto/Cab", note: "Delhi me auto daily ₹800-1200, Kanpur me e-rickshaw. 10km = ₹120-150, 20km = ₹250-350" }
    };
  } else {
    const distKm = Math.round(Math.abs(center.lat - srcCenter.lat)*111 + Math.abs(center.lng - srcCenter.lng)*85) || 480;
    transportOptions = {
      highway: { name: `NH ${44+Math.floor(Math.random()*30)}`, distance: `${distKm} km`, duration: `${Math.floor(distKm/60)}h ${distKm%60}m`, cost: `₹${Math.round(distKm*4)}-₹${Math.round(distKm*6)} (cab)`, best: "Sedan recommended, dhabas enroute" },
      train: {
        name: "Trains",
        options: [
          { name: `${src} → ${dest} Superfast`, time: "22:00 → 06:30", duration: "8h 30m", price: "₹350 SL / ₹950 3A", status: "Daily", from: src, to: dest },
          { name: `${src} → ${dest} Express`, time: "06:30 → 14:45", duration: "8h 15m", price: "₹300 SL", status: "Daily", from: src, to: dest },
        ],
        recommendation: "Overnight train saves 1 night hotel. Book 2A for comfort.",
      },
      flight: { name: "Flight", distance: `${distKm} km`, duration: `${Math.floor(distKm/550)+1}h 10m`, cost: `₹${3500+Math.floor(distKm*5)}-₹${6000+Math.floor(distKm*3)}`, note: "Book 2 weeks early for best fare." },
      local: { name: "Local Transport", note: "Auto ₹15/km, Cab daily ₹900-1400. 10km ₹120-150, 20km ₹250-350" }
    };
  }

  const themes = ["Arrival & City Lights", "Heritage & Food", "Adventure & Nature", "Bazaars & Hidden Gems", "Sunrise Farewell"];
  const perDayBudget = Math.round(budgetNum / daysNum);
  
  const itinerary = Array.from({ length: daysNum }, (_, i) => {
    const dayNum = i + 1;
    return {
      day: dayNum,
      title: `Day ${dayNum}: ${themes[i % themes.length]}`,
      theme: interestsArr[i % interestsArr.length],
      totalCost: `₹${Math.round(perDayBudget * 0.85)} - ₹${perDayBudget}`,
      places: [
        {
          name: dayNum === 1 ? `Journey from ${src} to ${dest}` : `${dest} - ${["Mall Road Walk", "Heritage Trail", "Lake View Point", "Fort Explorer", "Local Bazaar & Street Food"][i % 5]}`,
          description: dayNum === 1 
            ? `Start from ${src} via ${transportOptions.highway.name}. Check-in, evening chai at local market.`
            : `Explore ${dest} focused on ${interestsArr.join(", ")}. Authentic local vibes, guides available.`,
          time: i === 0 ? "06:00 AM" : "09:00 AM",
          duration: "3-4 hours",
          cost: `₹${300 + i*120}`,
          category: i === 0 ? "travel" : interestsArr[i % interestsArr.length],
          lat: center.lat + (Math.random()-0.5)*0.05,
          lng: center.lng + (Math.random()-0.5)*0.05,
          tips: "Start early, carry water & power bank."
        },
        {
          name: ["Red Fort & Chandni Chowk", "Baga Beach", "Hawa Mahal", "Calicut Beach", "Pangong View", "Kashi Ghat", "City Palace", "India Gate"][Object.keys(coords).indexOf(key) % 8] || "Heritage Site",
          description: `Must-visit in ${dest}. History, views, perfect photos. Local guide ₹300.`,
          time: "11:30 AM",
          duration: "2-3 hours",
          cost: `₹${200 + i*100}`,
          category: "sightseeing",
          lat: center.lat + (Math.random()-0.5)*0.08,
          lng: center.lng + (Math.random()-0.5)*0.08,
          tips: "Book online to skip queue."
        },
        {
          name: ["Paratha Wali Gali", "Fish Thali House", "LMB Sweets", "Sadya Spot", "Chai & Momos", "Kachori Gali", "Ambrai View"][i % 7],
          description: `Famous food joint. Signature thali loved by locals. Budget-friendly.`,
          time: "01:30 PM",
          duration: "1 hour",
          cost: `₹${250 + i*40} per person`,
          category: "food",
          lat: center.lat + (Math.random()-0.5)*0.03,
          lng: center.lng + (Math.random()-0.5)*0.03,
          tips: "Try thali — best value."
        },
        {
          name: ["Sunset at Local Fort", "Sunset Cruise", "Village Tour", "Spice Market", "Ganga Aarti", "Boat Ride"][i % 6],
          description: `Evening in ${dest}. ${travelStyle === "luxury" ? "Private guide, premium." : travelStyle === "budget" ? "Group tour, budget." : "Comfortable, well-rated."}`,
          time: "04:30 PM",
          duration: "3 hours",
          cost: `₹${800 + i*200}`,
          category: "activity",
          lat: center.lat + (Math.random()-0.5)*0.1,
          lng: center.lng + (Math.random()-0.5)*0.1,
          tips: "Carry sunscreen."
        }
      ]
    };
  });

  return {
    title: `${daysNum} Days • ${src} → ${dest} ✈️`,
    itinerary,
    overview: {
      totalEstimatedCost: `₹${budgetNum - 800} - ₹${budgetNum + 500}`,
      bestTimeToVisit: key.includes("goa") ? "Nov - Feb" : key.includes("leh") ? "May - Sep" : key.includes("kerala") ? "Oct - Feb" : "Oct - Mar",
      localCuisine: key.includes("jaipur") ? ["Dal Baati Churma", "Ghewar", "Laal Maas"] : key.includes("delhi") ? ["Chole Bhature", "Paratha", "Nihari"] : key.includes("kanpur") ? ["Thaggu ke Laddu", "Biryani", "Samosa"] : ["Local Thali", "Chai & Pakora", "Momos"],
      packingTips: ["Walking shoes", "Power bank 20k", "Sunscreen", "Jacket for evenings", "Aadhaar copy"],
      transportTips: `${src} → ${dest} best: ${transportOptions.train.options[0].name} (${transportOptions.train.options[0].time}). Highway ${transportOptions.highway.distance}.`,
    },
    hotels: [
      { name: `The ${dest} Grand`, area: "Near Station / Mall Road", pricePerNight: `₹${travelStyle==="luxury"?4500:travelStyle==="budget"?900:1800}`, rating: "4.6 ★ (1.8k)", why: "Central, families" },
      { name: `${dest} Hostel & Cafe`, area: "Old City", pricePerNight: `₹${travelStyle==="luxury"?3200:travelStyle==="budget"?500:1200}`, rating: "4.3 ★", why: "Budget + solo" },
      { name: `Premium ${dest} Resort`, area: "Scenic View", pricePerNight: `₹${travelStyle==="luxury"?7500:travelStyle==="budget"?1500:2800}`, rating: "4.8 ★", why: "Valley view, luxury" },
    ],
    food: [
      { dish: "Local Thali", where: "Main Market", cost: "₹250" },
      { dish: "Street Chai & Samosa", where: "Station Road stalls", cost: "₹80" },
      { dish: "Cafe Special", where: "Mall Road cafe", cost: "₹400" },
    ],
    budgetBreakdown: {
      stay: `₹${Math.round(budgetNum*0.35)}`,
      food: `₹${Math.round(budgetNum*0.25)}`,
      transport: `₹${Math.round(budgetNum*0.25)}`,
      activities: `₹${Math.round(budgetNum*0.15)}`,
      total: `₹${budgetNum}`
    },
    transportOptions,
    mapCenter: center,
    srcCenter
  };
};

export const generateItinerary = async (params) => {
  const { source, destination, days, travelers, budget, interests, travelStyle, budgetType } = params;

  if (!config.geminiKey) {
    console.log("🤖 No GEMINI_API_KEY, using MOCK itinerary");
    await new Promise(r => setTimeout(r, 1500));
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
You are YatraGenie AI, India travel expert. Create itinerary with TRANSPORT OPTIONS.

INPUT: Source: ${source}, Destination: ${destination}, Days:${days}, Travelers:${travelers}, Budget:₹${totalBudget} (${travelStyle}), Interests:${interests?.join(", ")}

Return JSON:
{
  "title": "string",
  "itinerary": [{"day":1,"title":"string","theme":"string","totalCost":"₹X - ₹Y","places":[{"name":"string","description":"string","time":"09:00 AM","duration":"2 hours","cost":"₹X","category":"sightseeing","lat":number,"lng":number,"tips":"string"}]}],
  "overview": {"totalEstimatedCost":"₹X","bestTimeToVisit":"string","localCuisine":["dish"],"packingTips":["tip"],"transportTips":"string"},
  "hotels": [{"name":"string","area":"string","pricePerNight":"₹X","rating":"4.x ★","why":"string"}],
  "food": [{"dish":"string","where":"string","cost":"₹X"}],
  "budgetBreakdown": {"stay":"₹X","food":"₹X","transport":"₹X","activities":"₹X","total":"₹X"},
  "transportOptions": {
    "highway": {"name":"NH...","distance":"X km","duration":"Xh","cost":"₹X","best":"string"},
    "train": {"name":"Trains","options":[{"name":"Shram Shakti 12451","time":"23:55 → 06:10","duration":"6h 15m","price":"₹...","status":"Daily","from":"CNB","to":"NDLS"}],"recommendation":"string"},
    "flight": {"name":"Flight","distance":"X km","duration":"Xh","cost":"₹X","note":"string"},
    "local": {"name":"Local","note":"string"}
  },
  "mapCenter": {"lat":number,"lng":number},
  "srcCenter": {"lat":number,"lng":number}
}
Rules: 4 places/day, lat/lng realistic for ${destination} (±0.1 deg), 3 hotels, 3 foods, transportOptions MUST include highway/train/flight/local, train times realistic for India, INR costs, ONLY JSON.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    
    if (!parsed.mapCenter || !parsed.mapCenter.lat) {
      const mock = getMockItinerary(params);
      parsed.mapCenter = mock.mapCenter; parsed.srcCenter = mock.srcCenter; parsed.transportOptions = mock.transportOptions;
    }
    if (!parsed.transportOptions) parsed.transportOptions = getMockItinerary(params).transportOptions;
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
    return { ...getMockItinerary(params), isMock: true, geminiError: err.message };
  }
};

export const chatWithItinerary = async (trip, userMessage) => {
  if (!config.geminiKey) {
    return `For your ${trip.source} → ${trip.destination} trip, "${userMessage}" — Try local market evening! (Add GEMINI_API_KEY for Gemini chat)`;
  }
  try {
    const genAI = new GoogleGenerativeAI(config.geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Trip: ${JSON.stringify(trip).slice(0,3000)}. User: ${userMessage}. Answer Hinglish friendly, concise <120 words, INR. Support Hindi/English/Marathi/Kannada as user language.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    return "AI busy, try again.";
  }
};
