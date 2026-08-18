import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import PlaceCard from '../../features/places/components/PlaceCard.jsx';
import TripMap from '../../features/maps/components/TripMap.jsx';
import Tabs from '../../components/ui/Tabs.jsx';
import { useGeolocation } from '../../features/location/hooks/useGeolocation.js';
import { placesApi } from '../../features/places/places.api.js';
import { toast } from '../../store/ui.store.js';

export default function Nearby() {
  const { locate, point } = useGeolocation();
  const [radius, setRadius] = useState(5);
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);

  const search = async (here) => {
    const loc = here || point || (await locate());
    const res = await placesApi.nearby({ lat: loc.lat, lng: loc.lng, radiusKm: radius, category: category || undefined });
    setItems(res.items || []);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold">What's around you?</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {[0.5, 1, 5, 10].map((r) => (
          <button key={r} type="button" onClick={() => setRadius(r)} className={`rounded-full px-3 py-1 text-sm ${radius === r ? 'bg-accent' : 'bg-white/5'}`}>
            {r < 1 ? '500m' : `${r}km`}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <Tabs
          value={category || 'all'}
          onChange={(v) => setCategory(v === 'all' ? '' : v)}
          tabs={['all', 'temple', 'gurudwara', 'historical', 'nature', 'food'].map((c) => ({ id: c, label: c }))}
        />
      </div>
      <div className="mt-6">
        <TripMap items={items} user={point} className="h-72" />
      </div>
      <Button
        className="mt-4"
        onClick={async () => {
          try {
            await search();
          } catch {
            toast('Location permission is required.', 'warning');
          }
        }}
      >
        Use my location
      </Button>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>
    </DashboardLayout>
  );
}
