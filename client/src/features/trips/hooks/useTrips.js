import { useQuery } from '@tanstack/react-query';
import { tripsApi } from '../trips.api.js';

export function useTrips(params) {
  return useQuery({ queryKey: ['trips', params], queryFn: () => tripsApi.list(params) });
}
