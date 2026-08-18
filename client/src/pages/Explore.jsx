import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Compass } from 'lucide-react';
import { placesApi, favoritesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';
import PlaceCard from '../components/travel/PlaceCard';
import PlaceDetailsModal from '../components/travel/PlaceDetailsModal';
import { PLACE_CATEGORIES } from '../constants/places';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { cn } from '../utils/cn';

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [input, setInput] = useState(q);
  const [category, setCategory] = useState('all');
  const [detailId, setDetailId] = useState(null);
  const debounced = useDebounce(input, 400);
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['places', debounced, category],
    queryFn: () => placesApi.search({ q: debounced, category: category === 'all' ? '' : category, limit: 24 }),
  });

  const { data: favs } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list('place'),
    enabled: isAuthenticated,
  });
  const savedIds = new Set((favs?.favorites || []).map((f) => f.refId));

  const favoriteMutation = useMutation({
    mutationFn: async ({ place, saved }) => {
      if (saved) {
        const res = await favoritesApi.list('place');
        const fav = res.favorites.find((f) => f.refId === place.id);
        if (fav) await favoritesApi.remove(fav.id);
      } else {
        await favoritesApi.add({
          type: 'place',
          refId: place.id,
          snapshot: { name: place.name, city: place.city, imageSlug: place.imageSlug, category: place.category },
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const toggleFavorite = (place, saved) => {
    if (!isAuthenticated) {
      toast.info('Sign in to save favorites.');
      navigate('/login');
      return;
    }
    favoriteMutation.mutate({ place, saved });
  };

  const places = data?.items || [];

  const onSearch = (v) => {
    setInput(v);
    setParams(v ? { q: v } : {});
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center pt-10">
        <h1 className="text-3xl sm:text-4xl font-bold">Explore India</h1>
        <p className="text-muted mt-2">Discover temples, gurudwaras, history, food and hidden gems.</p>
        <div className="relative mt-6">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={input}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full py-3.5 pl-11 pr-4 rounded-2xl bg-ink-850 border border-white/10 text-body text-base placeholder:text-muted/60 focus:border-brand-400/60 transition-colors shadow-card"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mt-6 py-1">
        {PLACE_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn('shrink-0 rounded-full border px-4 py-2 text-sm transition-colors', category === c.value ? 'border-brand-500/50 bg-brand-500/10 text-body' : 'border-white/[0.08] bg-white/[0.03] text-muted hover:text-body')}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : places.length === 0 ? (
          <EmptyState icon={Compass} title="Nothing here yet." description="Try a different search or category." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {places.map((p, i) => (
              <PlaceCard
                key={p.id}
                place={p}
                index={i}
                saved={savedIds.has(p.id)}
                onToggleFavorite={(saved) => toggleFavorite(p, saved)}
                onOpen={() => setDetailId(p.id)}
                onNavigate={() => setDetailId(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      <PlaceDetailsModal placeId={detailId} onClose={() => setDetailId(null)} />
    </div>
  );
}
