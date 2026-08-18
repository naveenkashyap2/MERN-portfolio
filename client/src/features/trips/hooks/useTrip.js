import { useQuery } from '@tanstack/react-query';
import { tripsApi } from '../trips.api.js';

export function useTrip(id) {
  return useQuery({ queryKey: ['trip', id], queryFn: () => tripsApi.get(id), enabled: Boolean(id) });
}
