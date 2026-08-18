import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export function useFavorite(type, refId, snapshot) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (saved) => {
      if (saved) {
        // find and remove
        const res = await favoritesApi.list(type);
        const fav = res.favorites.find((f) => f.refId === refId);
        if (fav) await favoritesApi.remove(fav.id);
      } else {
        await favoritesApi.add({ type, refId, snapshot });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const toggle = (currentSaved) => {
    if (!isAuthenticated) {
      toast.info('Sign in to save favorites.');
      navigate('/login');
      return;
    }
    mutation.mutate(currentSaved);
  };

  return { toggle, saving: mutation.isPending };
}
