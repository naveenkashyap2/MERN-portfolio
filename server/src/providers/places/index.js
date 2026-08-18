import { places, placesById, placesBySlug, PLACE_CATEGORIES } from './catalog.js';
import { haversineMeters } from '../../utils/distance.js';

/**
 * Places provider adapter.
 *
 * Interface: search(), getById(), byCategory(), nearby(), popular(), categories()
 * Swap this implementation for a verified provider without touching services.
 */
export const placesProvider = {
  categories: () => PLACE_CATEGORIES,

  getById: (id) => placesById.get(id) || placesBySlug.get(id) || null,

  search({ q = '', category = '', city = '', limit = 24, page = 1 } = {}) {
    const needle = String(q).trim().toLowerCase();
    let results = places.filter((p) => {
      if (needle) {
        const hay = `${p.name} ${p.city} ${p.state} ${p.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (category && category !== 'all' && p.category !== category && !p.categories.includes(category)) {
        return false;
      }
      if (city && p.city.toLowerCase() !== city.toLowerCase()) return false;
      return true;
    });

    const total = results.length;
    const offset = (page - 1) * limit;
    results = results.slice(offset, offset + limit);
    return { items: results, total, page, limit, hasMore: offset + limit < total };
  },

  byCategory(category) {
    return places.filter((p) => p.category === category || p.categories.includes(category));
  },

  popular(limit = 8) {
    return [...places].sort((a, b) => b.popular - a.popular || b.rating - a.rating).slice(0, limit);
  },

  nearby({ lat, lng, radiusKm = 5, category = '', limit = 12 }) {
    return places
      .map((p) => ({
        ...p,
        distanceMeters: haversineMeters(lat, lng, p.coordinates.lat, p.coordinates.lng),
      }))
      .filter((p) => p.distanceMeters <= radiusKm * 1000)
      .filter((p) => !category || category === 'all' || p.category === category || p.categories.includes(category))
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
      .slice(0, limit);
  },

  recommended({ interests = [], city = '', limit = 8 } = {}) {
    let scored = places.map((p) => {
      let score = p.rating + (p.popular ? 0.5 : 0);
      if (interests.length) {
        for (const i of interests) {
          if (p.categories.includes(i) || p.category === i) score += 3;
        }
      }
      if (city && p.city.toLowerCase() === city.toLowerCase()) score += 5;
      return { ...p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  },
};
