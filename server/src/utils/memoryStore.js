import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "memory.json");

// Ensure data dir exists
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}

class MemoryStore {
  constructor() {
    this.users = [];
    this.trips = [];
    this.idCounter = 1;
    this._load();
  }

  _load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const data = JSON.parse(raw);
        this.users = data.users || [];
        this.trips = data.trips || [];
        this.idCounter = data.idCounter || 1;
        console.log(`💾 Loaded ${this.users.length} users, ${this.trips.length} trips from disk`);
      }
    } catch (e) {
      console.warn("Failed to load memory store:", e.message);
    }
  }

  _save() {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify({
        users: this.users,
        trips: this.trips,
        idCounter: this.idCounter
      }, null, 2));
    } catch (e) {
      console.warn("Failed to save memory store:", e.message);
    }
  }

  // Call this after any mutation
  persist() {
    this._save();
  }

  generateId() {
    const id = `mem_${Date.now()}_${this.idCounter++}`;
    // Save idCounter
    setImmediate(()=>this._save());
    return id;
  }

  addUser(user) {
    this.users.push(user);
    this._save();
    return user;
  }

  addTrip(trip) {
    this.trips.push(trip);
    this._save();
    return trip;
  }

  updateUser(userId, updater) {
    const u = this.users.find(x=>x._id===userId);
    if (u) { updater(u); this._save(); }
    return u;
  }
}

export const memoryStore = new MemoryStore();
