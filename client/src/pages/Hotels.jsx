import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Hotel as HotelIcon, SlidersHorizontal } from 'lucide-react';
import { hotelsApi, favoritesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';
import Tabs from '../components/ui/Tabs';
import HotelCard from '../components/travel/HotelCard';
import Drawer from '../components/ui/Drawer';
import Slider from '../components/ui/Slider';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { formatINR } from '../utils/currency';

export default function Hotels() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('all');
  const [q, setQ] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(12000);
  const [minRating, setMinRating] = useState(0);
  const debounced = useDebounce(q, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['hotels', category, debounced, maxPrice, minRating],
    queryFn: () => hotelsApi.search({ category: category === 'all' ? '' : category, q: debounced, maxPrice, minRating }),
  });

  const { data: favs } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list('hotel'),
    enabled: isAuthenticated,
  });
  const savedIds = new Set((favs?.favorites || []).map((f) => f.refId));

  const favoriteMutation = useMutation({
    mutationFn: async ({ hotel, saved }) => {
      if (saved) {
        const res = await favoritesApi.list('hotel');
        const fav = res.favorites.find((f) => f.refId === hotel.id);
        if (fav) await favoritesApi.remove(fav.id);
      } else {
        await favoritesApi.add({ type: 'hotel', refId: hotel.id, snapshot: { name: hotel.name, city: hotel.city, imageSlug: hotel.imageSlug, category: hotel.category } });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const toggleFavorite = (hotel, saved) => {
    if (!isAuthenticated) {
      toast.info('Sign in to save hotels.');
      navigate('/login');
      return;
    }
    favoriteMutation.mutate({ hotel, saved });
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Hotels</h1>
          <p className="text-muted mt-1 text-sm">Budget, medium and premium stays.</p>
        </div>
        <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-body hover:bg-white/[0.08]">
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hotels or cities…" className="w-full h-11 rounded-xl bg-ink-850 border border-white/10 pl-10 pr-4 text-sm text-body placeholder:text-muted/60 focus:border-brand-400/60" />
      </div>

      <Tabs
        className="mt-5"
        value={category}
        onChange={setCategory}
        tabs={[
          { value: 'all', label: 'All' },
          { value: 'budget', label: 'Budget' },
          { value: 'medium', label: 'Medium' },
          { value: 'premium', label: 'Premium' },
        ]}
      />

      <div className="mt-6">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (data?.items || []).length === 0 ? (
          <EmptyState icon={HotelIcon} title="Nothing here yet." description="No stays match your filters." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data?.items || []).map((h, i) => (
              <HotelCard
                key={h.id}
                hotel={h}
                index={i}
                saved={savedIds.has(h.id)}
                onToggleFavorite={(saved) => toggleFavorite(h, saved)}
                onOpen={() => toast.info(`${h.name} — prices are estimates until a provider is connected.`)}
                onAddToTrip={() => toast.info('Open a trip and ask the AI assistant to add this stay.')}
              />
            ))}
          </div>
        )}
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted mb-3">Max price: <span className="text-body font-medium">{formatINR(maxPrice)}</span></p>
            <Slider value={maxPrice} min={500} max={12000} step={500} onChange={setMaxPrice} />
          </div>
          <div>
            <p className="text-sm text-muted mb-3">Minimum rating: <span className="text-body font-medium">{minRating || 'Any'}</span></p>
            <div className="flex gap-2">
              {[0, 4, 4.5, 4.8].map((r) => (
                <button key={r} onClick={() => setMinRating(r)} className={`flex-1 rounded-lg border px-3 py-2 text-sm ${minRating === r ? 'border-brand-500/50 bg-brand-500/10 text-body' : 'border-white/[0.08] text-muted'}`}>
                  {r === 0 ? 'Any' : `${r}★`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
