// In-memory fallback when MongoDB is not available
class MemoryStore {
  constructor() {
    this.users = [];
    this.trips = [];
    this.idCounter = 1;
  }
  generateId() {
    return `mem_${Date.now()}_${this.idCounter++}`;
  }
}

export const memoryStore = new MemoryStore();
