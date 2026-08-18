import { useEffect, useRef, useState } from 'react';
import { watchPosition } from '../../../services/location.service.js';
import { locationApi } from '../location.api.js';

export function useLocationTracking(sessionId) {
  const [point, setPoint] = useState(null);
  const lastSent = useRef(0);

  useEffect(() => {
    if (!sessionId) return undefined;
    const stop = watchPosition(async (p) => {
      setPoint(p);
      const now = Date.now();
      if (now - lastSent.current < 8000) return;
      lastSent.current = now;
      try {
        await locationApi.update({
          sessionId,
          latitude: p.lat,
          longitude: p.lng,
          accuracy: p.accuracy,
          timestamp: p.timestamp,
        });
      } catch {
        // keep UI alive if a single ping fails
      }
    });
    return stop;
  }, [sessionId]);

  return { point };
}
