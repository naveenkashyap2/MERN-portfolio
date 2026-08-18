import { useState } from 'react';
import { storage } from '../services/storage.service.js';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => storage.get(key, initial));
  const update = (next) => {
    const resolved = typeof next === 'function' ? next(value) : next;
    setValue(resolved);
    storage.set(key, resolved);
  };
  return [value, update];
}
