import { hotels, hotelsById } from './catalog.js';

/**
 * Hotels provider adapter.
 * search() / getById() / byCategory() — replace with a verified provider
 * (OTA / GDS) in production. Availability is always labelled "estimate" here.
 */
export const hotelsProvider = {
  getById: (id) => hotelsById.get(id) || null,

  search({
    q = '',
    city = '',
    category = '',
    minPrice,
    maxPrice,
    minRating,
    amenities = [],
    limit = 20,
    page = 1,
  } = {}) {
    const needle = String(q).trim().toLowerCase();
    let results = hotels.filter((h) => {
      if (needle && !`${h.name} ${h.city}`.toLowerCase().includes(needle)) return false;
      if (city && h.city.toLowerCase() !== city.toLowerCase()) return false;
      if (category && category !== 'all' && h.category !== category) return false;
      if (minPrice !== undefined && h.pricePerNight < Number(minPrice)) return false;
      if (maxPrice !== undefined && h.pricePerNight > Number(maxPrice)) return false;
      if (minRating !== undefined && h.rating < Number(minRating)) return false;
      if (amenities.length) {
        for (const a of amenities) {
          if (!h.amenities.some((x) => x.toLowerCase().includes(a.toLowerCase()))) return false;
        }
      }
      return true;
    });

    const total = results.length;
    const offset = (page - 1) * limit;
    results = results.slice(offset, offset + limit);
    return { items: results, total, page, limit, hasMore: offset + limit < total };
  },

  byCategory(category) {
    return hotels.filter((h) => h.category === category);
  },

  recommended({ city = '', stayPreference = 'medium', limit = 4 } = {}) {
    const order = { budget: 0, medium: 1, premium: 2 };
    let list = [...hotels];
    if (city) list = list.filter((h) => h.city.toLowerCase() === city.toLowerCase());
    list.sort((a, b) => {
      const aRank = Math.abs(order[a.category] - order[stayPreference] || 0);
      const bRank = Math.abs(order[b.category] - order[stayPreference] || 0);
      return aRank - bRank || b.rating - a.rating;
    });
    return list.slice(0, limit);
  },
};
