import { useQuery } from '@tanstack/react-query';
import { transportApi } from '../transport.api.js';

export function useTrains(params, enabled) {
  return useQuery({ queryKey: ['trains', params], queryFn: () => transportApi.trains(params), enabled });
}
