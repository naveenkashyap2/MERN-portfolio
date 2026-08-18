const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');

const stores = new Map();
const persistFile = path.resolve(__dirname, '../../.data/memory.json');

function loadPersisted() {
  try {
    if (!fs.existsSync(persistFile)) return;
    const raw = JSON.parse(fs.readFileSync(persistFile, 'utf8'));
    Object.entries(raw).forEach(([name, rows]) => stores.set(name, rows));
  } catch {
    // ignore corrupt cache
  }
}

function persist() {
  try {
    fs.mkdirSync(path.dirname(persistFile), { recursive: true });
    const raw = {};
    stores.forEach((rows, name) => {
      raw[name] = rows;
    });
    fs.writeFileSync(persistFile, JSON.stringify(raw));
  } catch {
    // ignore disk errors in demo mode
  }
}

loadPersisted();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function idsEqual(a, b) {
  if (a == null || b == null) return a === b;
  return String(a) === String(b);
}

function matchValue(docVal, filterVal) {
  if (filterVal === null) return docVal == null;
  if (filterVal && typeof filterVal === 'object' && !Array.isArray(filterVal) && !(filterVal instanceof Date)) {
    if ('$gt' in filterVal) return docVal > filterVal.$gt;
    if ('$gte' in filterVal) return docVal >= filterVal.$gte;
    if ('$lt' in filterVal) return docVal < filterVal.$lt;
    if ('$lte' in filterVal) return docVal <= filterVal.$lte;
    if ('$ne' in filterVal) return !idsEqual(docVal, filterVal.$ne);
    if ('$in' in filterVal) return filterVal.$in.some((v) => idsEqual(docVal, v));
    if ('$nin' in filterVal) return !(filterVal.$nin || []).some((v) => idsEqual(docVal, v));
  }
  return idsEqual(docVal, filterVal);
}

function matches(doc, filter = {}) {
  if (filter.$or) return filter.$or.some((part) => matches(doc, part));
  if (filter.$and) return filter.$and.every((part) => matches(doc, part));
  return Object.entries(filter).every(([key, value]) => {
    if (key.startsWith('$')) return true;
    return matchValue(getPath(doc, key), value);
  });
}

function applySelect(doc, select, hidden) {
  const out = clone(doc);
  hidden.forEach((field) => {
    if (!select || !String(select).includes(`+${field}`)) delete out[field];
  });
  return out;
}

function createMemoryModel(name, { hidden = [], unique = [] } = {}) {
  if (!stores.has(name)) stores.set(name, []);
  const docs = () => stores.get(name);

  function hydrate(raw) {
    const doc = raw;
    doc.toObject = () => clone(doc);
    doc.save = async () => {
      const list = docs();
      if (Array.isArray(doc.itinerary)) {
        doc.itinerary = doc.itinerary
          .filter((x) => x && typeof x === 'object')
          .map((it, i) => ({
            ...it,
            _id: it._id || randomUUID().replace(/-/g, '').slice(0, 24),
            order: it.order ?? i,
          }));
      }
      if (Array.isArray(doc.messages)) {
        doc.messages = doc.messages
          .filter((m) => m && typeof m === 'object')
          .map((m) => ({ ...m, _id: m._id || randomUUID().replace(/-/g, '').slice(0, 24) }));
      }
      const idx = list.findIndex((d) => idsEqual(d._id, doc._id));
      doc.updatedAt = new Date().toISOString();
      const stored = JSON.parse(JSON.stringify(doc));
      if (idx === -1) list.push(stored);
      else list[idx] = stored;
      persist();
      return hydrate(clone(stored));
    };
    doc.deleteOne = async () => {
      const list = docs();
      const idx = list.findIndex((d) => idsEqual(d._id, doc._id));
      if (idx >= 0) list.splice(idx, 1);
      persist();
      return { deletedCount: idx >= 0 ? 1 : 0 };
    };
    if (Array.isArray(doc.itinerary)) {
      doc.itinerary.id = (id) => {
        const item = doc.itinerary.find((i) => idsEqual(i._id, id));
        if (!item) return null;
        item.deleteOne = () => {
          const i = doc.itinerary.findIndex((x) => idsEqual(x._id, id));
          if (i >= 0) doc.itinerary.splice(i, 1);
        };
        return item;
      };
    }
    if (doc.preferences && typeof doc.preferences === 'object') {
      doc.preferences.toObject = () => clone(doc.preferences);
    }
    return doc;
  }

  function query(filter = {}) {
    let rows = docs().filter((d) => matches(d, filter)).map(clone);
    let select = '';
    const api = {
      select(s) {
        select = s;
        return api;
      },
      sort(spec) {
        const entries = Object.entries(spec || {});
        if (entries.length) {
          const [field, dir] = entries[0];
          rows.sort((a, b) => {
            if (a[field] < b[field]) return dir === -1 ? 1 : -1;
            if (a[field] > b[field]) return dir === -1 ? -1 : 1;
            return 0;
          });
        }
        return api;
      },
      skip(n) {
        rows = rows.slice(n);
        return api;
      },
      limit(n) {
        rows = rows.slice(0, n);
        return api;
      },
      lean() {
        return api;
      },
      then(resolve, reject) {
        return Promise.resolve(rows.map((r) => hydrate(applySelect(r, select, hidden)))).then(resolve, reject);
      },
    };
    return api;
  }

  const Model = {
    async create(data) {
      const list = Array.isArray(data) ? data : [data];
      const created = list.map((item) => {
        for (const field of unique) {
          if (item[field] && docs().some((d) => d[field] === item[field] && !d.deletedAt)) {
            const err = new Error('duplicate');
            err.code = 11000;
            throw err;
          }
        }
        const doc = {
          ...clone(item),
          _id: item._id || randomUUID().replace(/-/g, '').slice(0, 24),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        if (Array.isArray(doc.itinerary)) {
          doc.itinerary = doc.itinerary.map((it, i) => ({
            ...it,
            _id: it._id || randomUUID().replace(/-/g, '').slice(0, 24),
            order: it.order ?? i,
          }));
        }
        if (Array.isArray(doc.messages)) {
          doc.messages = doc.messages.map((m) => ({
            ...m,
            _id: m._id || randomUUID().replace(/-/g, '').slice(0, 24),
          }));
        }
        docs().push(doc);
        return hydrate(clone(doc));
      });
      persist();
      return Array.isArray(data) ? created : created[0];
    },
    find(filter) {
      return query(filter);
    },
    findOne(filter) {
      const api = query(filter);
      return {
        select(s) {
          api.select(s);
          return this;
        },
        then(resolve, reject) {
          return Promise.resolve(api)
            .then((rows) => rows[0] || null)
            .then(resolve, reject);
        },
      };
    },
    async findById(id) {
      return docs()
        .filter((d) => idsEqual(d._id, id))
        .map((d) => hydrate(clone(d)))[0] || null;
    },
    async countDocuments(filter) {
      return docs().filter((d) => matches(d, filter)).length;
    },
    async updateMany(filter, update) {
      let n = 0;
      docs().forEach((d, i) => {
        if (!matches(d, filter)) return;
        const next = { ...d, ...(update.$set || update) };
        docs()[i] = next;
        n += 1;
      });
      persist();
      return { modifiedCount: n };
    },
    async updateOne(filter, update) {
      const idx = docs().findIndex((d) => matches(d, filter));
      if (idx === -1) return { modifiedCount: 0 };
      docs()[idx] = { ...docs()[idx], ...(update.$set || update) };
      persist();
      return { modifiedCount: 1 };
    },
    async deleteMany(filter) {
      const list = docs();
      const keep = list.filter((d) => !matches(d, filter));
      const deletedCount = list.length - keep.length;
      stores.set(name, keep);
      persist();
      return { deletedCount };
    },
    async deleteOne(filter) {
      const list = docs();
      const idx = list.findIndex((d) => matches(d, filter));
      if (idx === -1) return { deletedCount: 0 };
      list.splice(idx, 1);
      return { deletedCount: 1 };
    },
    async aggregate(pipeline = []) {
      let rows = docs().map(clone);
      for (const stage of pipeline) {
        if (stage.$match) rows = rows.filter((d) => matches(d, stage.$match));
        if (stage.$group) {
          const grouped = new Map();
          const idField = String(stage.$group._id || '').replace('$', '');
          rows.forEach((row) => {
            const key = idField ? row[idField] : '_all';
            const acc = grouped.get(key) || { _id: key };
            Object.entries(stage.$group).forEach(([alias, spec]) => {
              if (alias === '_id') return;
              if (spec.$sum) {
                const field = String(spec.$sum).replace('$', '');
                acc[alias] = (acc[alias] || 0) + (Number(row[field]) || 0);
              }
            });
            grouped.set(key, acc);
          });
          rows = [...grouped.values()];
        }
      }
      return rows;
    },
  };

  return Model;
}

function resetMemory() {
  stores.clear();
}

module.exports = { createMemoryModel, resetMemory };
