import { useQuery } from '@tanstack/react-query';
import { placesApi } from '../places.api.js';

export function usePlaces(params) {
  return useQuery({ queryKey: ['places', params], queryFn: () => placesApi.search(params) });
}
