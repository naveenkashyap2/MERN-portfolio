import { createId } from '../utils/id.js';

/**
 * Minimal in-memory collection used by the demo store.
 * The API surface mirrors what a Mongo-backed repository would expose, so
 * controllers/services never care which persistence backend is active.
 */
export function createCollection(initial = []) {
  const items = [...initial];

  return {
    get all() {
      return items;
    },
    count() {
      return items.length;
    },
    find(predicate) {
      return items.find(predicate) || null;
    },
    filter(predicate) {
      return items.filter(predicate);
    },
    findById(id) {
      return items.find((i) => i.id === id) || null;
    },
    insert(item) {
      items.push(item);
      return item;
    },
    update(id, patch) {
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) return null;
      items[idx] = { ...items[idx], ...patch, id };
      return items[idx];
    },
    replace(id, item) {
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) return null;
      items[idx] = { ...item, id };
      return items[idx];
    },
    remove(id) {
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) return false;
      items.splice(idx, 1);
      return true;
    },
    removeWhere(predicate) {
      const before = items.length;
      for (let i = items.length - 1; i >= 0; i -= 1) {
        if (predicate(items[i])) items.splice(i, 1);
      }
      return before - items.length;
    },
  };
}

export function newId(prefix = 'id') {
  return createId(`${prefix}_`, 10);
}

export function now() {
  return new Date();
}

export function clone(data) {
  return JSON.parse(JSON.stringify(data));
}
