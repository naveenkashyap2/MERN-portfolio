import { useQuery } from '@tanstack/react-query';
import { hotelsApi } from '../hotels.api.js';

export function useHotels(params) {
  return useQuery({ queryKey: ['hotels', params], queryFn: () => hotelsApi.search(params) });
}
