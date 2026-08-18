import { useQuery } from '@tanstack/react-query';
import { expensesApi } from '../expenses.api.js';

export function useExpenses(tripId) {
  return useQuery({ queryKey: ['expenses', tripId], queryFn: () => expensesApi.list(tripId), enabled: Boolean(tripId) });
}
