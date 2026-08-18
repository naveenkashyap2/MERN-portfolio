const { PLACES, CITIES } = require('../../data/indiaCatalog');
const { haversineKm } = require('../../utils/distance');
const { TRUST } = require('../../constants');

function withTrust(place) {
  return {
    ...place,
    coordinatesVerified: true,
    trust: TRUST.CATALOG,
    source: 'india-catalog',
    openingHours: null,
    openingHoursTrust: 'unverified',
    availabilityStatus: 'catalog',
  };
}

function search({ q = '', category, city, page = 1, limit = 20 }) {
  const query = q.trim().toLowerCase();
  let items = PLACES.filter((p) => {
    if (category && p.category !== category) return false;
    if (city && p.city.toLowerCase() !== city.toLowerCase()) return false;
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.state.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  });
  const total = items.length;
  const start = (page - 1) * limit;
  items = items.slice(start, start + limit).map(withTrust);
  return { items, total };
}

function getById(id) {
  const place = PLACES.find((p) => p.id === id);
  return place ? withTrust(place) : null;
}

function nearby({ lat, lng, radiusKm = 10, category, limit = 20 }) {
  const items = PLACES.map((p) => ({
    ...withTrust(p),
    distanceKm: Number(haversineKm({ lat, lng }, { lat: p.lat, lng: p.lng }).toFixed(2)),
  }))
    .filter((p) => p.distanceKm <= radiusKm)
    .filter((p) => !category || p.category === category)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
  return { items, total: items.length, trust: TRUST.CATALOG };
}

function byCategory(category, { page = 1, limit = 20, city } = {}) {
  return search({ category, city, page, limit });
}

function findCity(name) {
  if (!name) return null;
  const q = name.trim().toLowerCase();
  return (
    CITIES.find((c) => c.name.toLowerCase() === q || c.id === q) ||
    CITIES.find((c) => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase()))
  );
}

function placesInCity(cityName) {
  const city = findCity(cityName);
  if (!city) {
    return PLACES.filter((p) => p.city.toLowerCase() === String(cityName).toLowerCase()).map(withTrust);
  }
  return PLACES.filter((p) => p.city.toLowerCase() === city.name.toLowerCase()).map(withTrust);
}

module.exports = {
  search,
  getById,
  nearby,
  byCategory,
  findCity,
  placesInCity,
  status: () => ({ name: 'catalog', connected: true, live: false }),
};
