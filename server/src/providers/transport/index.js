import { trains, buses, localTransport } from './catalog.js';

/**
 * Transport provider adapter.
 * All results are EDITORIAL ESTIMATES unless a verified provider is connected.
 */
export const transportProvider = {
  searchTrains({ from = '', to = '', date = '' } = {}) {
    let results = trains;
    if (from) results = results.filter((t) => t.from.toLowerCase().includes(from.toLowerCase()));
    if (to) results = results.filter((t) => t.to.toLowerCase().includes(to.toLowerCase()));
    return {
      items: results.map((t) => ({ ...t, verified: false, note: 'Schedule is an estimate — verify with IRCTC.' })),
      date: date || null,
      source: 'estimate',
    };
  },

  searchBuses({ from = '', to = '', date = '' } = {}) {
    let results = buses;
    if (from) results = results.filter((b) => b.from.toLowerCase().includes(from.toLowerCase()));
    if (to) results = results.filter((b) => b.to.toLowerCase().includes(to.toLowerCase()));
    return {
      items: results.map((b) => ({ ...b, verified: false, note: 'Fare & timing are estimates.' })),
      date: date || null,
      source: 'estimate',
    };
  },

  getTrain: (id) => trains.find((t) => t.id === id) || null,
  getBus: (id) => buses.find((b) => b.id === id) || null,

  localModes: () => localTransport,

  /** Cross-modal comparison for a given corridor. */
  compare({ from = '', to = '' } = {}) {
    const train = trains.find((t) => t.from.includes(from) && t.to.includes(to)) || trains[0];
    const bus = buses.find((b) => b.from.includes(from) && b.to.includes(to)) || buses[0];
    return {
      corridor: `${from} → ${to}`,
      options: [
        {
          mode: 'train',
          label: 'Train',
          durationMin: train?.durationMin ?? 300,
          fare: train?.fare ?? 600,
          note: 'Fast & comfortable',
          recommended: 'Best for speed & comfort',
          verified: false,
        },
        {
          mode: 'bus',
          label: 'Bus',
          durationMin: bus?.durationMin ?? 360,
          fare: bus?.fare ?? 450,
          note: 'Wide network',
          recommended: 'Best for budget',
          verified: false,
        },
        {
          mode: 'car',
          label: 'Car',
          durationMin: Math.round((train?.durationMin ?? 300) * 0.85),
          fare: Math.round((train?.fare ?? 600) * 3),
          note: 'Door-to-door freedom',
          recommended: 'Best for comfort',
          verified: false,
        },
      ],
      source: 'estimate',
    };
  },
};
