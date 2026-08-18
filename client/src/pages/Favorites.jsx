import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MapPin, Hotel, Route as RouteIcon, Trash2 } from 'lucide-react';
import { favoritesApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import Tabs from '../components/ui/Tabs';
import EmptyState from '../components/ui/EmptyState';
import { imageFor } from '../constants/images';
import { CATEGORY_LABELS } from '../constants/places';
import { formatINR } from '../utils/currency';

export default function Favorites() {
  const [tab, setTab] = useState('place');
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list(),
  });

  const remove = useMutation({
    mutationFn: (id) => favoritesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Removed from favorites.');
    },
  });

  const favorites = (data?.favorites || []).filter((f) => f.type === tab);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold">Favorites</h1>
      <p className="text-muted mt-1 text-sm">Places and stays you love.</p>

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'place', label: 'Places', icon: MapPin },
          { value: 'hotel', label: 'Hotels', icon: Hotel },
          { value: 'trip', label: 'Trips', icon: RouteIcon },
        ]}
      />

      <div className="mt-6">
        {favorites.length === 0 ? (
          <EmptyState icon={Heart} title="Save places you love." description="Tap the heart on any place or hotel to keep it here." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((f) => {
              const s = f.snapshot || {};
              return (
                <div key={f.id} className="card overflow-hidden group">
                  <img src={imageFor(s.imageSlug, tab === 'hotel' ? 'hotel' : 'hero')} alt={s.name} className="h-36 w-full object-cover" />
                  <div className="p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-body truncate">{s.name || f.refId}</p>
                      <p className="text-xs text-muted mt-0.5">{CATEGORY_LABELS[s.category] || s.city || tab}</p>
                    </div>
                    <button onClick={() => remove.mutate(f.id)} className="p-2 text-danger hover:bg-danger/10 rounded-lg" aria-label="Remove">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
