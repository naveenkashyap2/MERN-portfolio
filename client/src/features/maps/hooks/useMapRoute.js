import { useMemo } from 'react';

export function useMapRoute(items = []) {
  return useMemo(
    () => items.filter((i) => i.lat != null && i.lng != null).map((i) => ({ lat: i.lat, lng: i.lng, name: i.title })),
    [items]
  );
}
