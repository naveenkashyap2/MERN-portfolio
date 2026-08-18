import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import PlaceFilters from '../../features/places/components/PlaceFilters.jsx';
import PlaceCard from '../../features/places/components/PlaceCard.jsx';
import PlaceDetails from '../../features/places/components/PlaceDetails.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { usePlaces } from '../../features/places/hooks/usePlaces.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { profileApi } from '../../features/profile/profile.api.js';
import { toast } from '../../store/ui.store.js';

export default function Explore() {
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('popular');
  const dq = useDebounce(q);
  const category = cat === 'popular' || cat === 'nearby' ? undefined : cat;
  const { data, isLoading } = usePlaces({ q: dq, category, limit: 24 });
  const selected = data?.items?.find((p) => p.id === params.get('id'));

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold">Explore India</h1>
      <input
        className="input mt-4 max-w-xl"
        placeholder="What are you looking for?"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="mt-6">
        <PlaceFilters value={cat} onChange={setCat} />
      </div>
      {selected && (
        <div className="mt-6">
          <PlaceDetails place={selected} />
        </div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading && Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-56" />)}
        {data?.items?.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onFav={async (p) => {
              await profileApi.addFavorite({ type: p.category === 'gurudwara' ? 'gurudwara' : p.category === 'temple' ? 'temple' : 'place', placeId: p.id, title: p.name, subtitle: p.city });
              toast('Saved to favorites.', 'success');
            }}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
