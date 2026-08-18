const { STAY_AREAS } = require('../../data/indiaCatalog');
const { TRUST, UNVERIFIED_LIVE } = require('../../constants');

function decorate(item) {
  return {
    ...item,
    trust: TRUST.CATALOG,
    availabilityStatus: 'unverified',
    availabilityMessage: UNVERIFIED_LIVE,
    priceTrust: TRUST.ESTIMATED,
    source: 'stay-area-catalog',
    provider: 'none',
  };
}

function search({ city, category, page = 1, limit = 20 }) {
  let items = STAY_AREAS.filter((h) => {
    if (city && h.city.toLowerCase() !== String(city).toLowerCase()) return false;
    if (category && category !== 'all' && h.category !== category) return false;
    return true;
  });
  const total = items.length;
  items = items.slice((page - 1) * limit, (page - 1) * limit + limit).map(decorate);
  return { items, total, availabilityMessage: UNVERIFIED_LIVE };
}

function getById(id) {
  const found = STAY_AREAS.find((h) => h.id === id);
  return found ? decorate(found) : null;
}

function recommended({ city, stayPreference }) {
  const { items } = search({ city, category: stayPreference || 'all', page: 1, limit: 8 });
  return {
    items: items.map((i) => ({ ...i, trust: TRUST.AI_RECOMMENDED })),
    availabilityMessage: UNVERIFIED_LIVE,
  };
}

module.exports = {
  search,
  getById,
  recommended,
  status: () => ({ name: 'catalog', connected: true, live: false }),
};
