import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LocateFixed, MapPin, Star, Navigation, Crosshair } from 'lucide-react';
import { placesApi } from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import MapCanvas from '../components/maps/MapCanvas';
import { NEARBY_RADII, NEARBY_CATEGORIES, CATEGORY_LABELS } from '../constants/places';
import { imageFor } from '../constants/images';
import { ListSkeleton } from '../components/ui/Skeleton';
import { formatKm } from '../utils/distance';
import { cn } from '../utils/cn';

const SAMPLE = { lat: 28.6315, lng: 77.2167, name: 'Connaught Place, Delhi' };

export default function Nearby() {
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [radius, setRadius] = useState(5);
  const [category, setCategory] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['nearby', location?.lat, location?.lng, radius, category],
    queryFn: () => placesApi.nearby({ lat: location.lat, lng: location.lng, radius, category: category === 'all' ? '' : category, limit: 12 }),
    enabled: Boolean(location),
  });

  const useCurrentLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, name: 'Your location' });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 },
    );
  };

  const items = data?.items || [];
  const markers = location
    ? [
        { id: 'user', lat: location.lat, lng: location.lng, kind: 'user', color: '#3B82F6', label: 'You' },
        ...items.map((p) => ({ id: p.id, lat: p.coordinates.lat, lng: p.coordinates.lng, color: p.category === 'temple' || p.category === 'gurudwara' ? '#F59E0B' : '#94A3B8' })),
      ]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">What's around you?</h1>
          <p className="text-muted mt-1 text-sm">Food, temples, gurudwaras and places near you.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={LocateFixed} loading={locating} onClick={useCurrentLocation}>
            {location ? 'Update location' : 'Use my location'}
          </Button>
          {!location && (
            <Button variant="ghost" icon={MapPin} onClick={() => setLocation(SAMPLE)}>
              Try Delhi sample
            </Button>
          )}
        </div>
      </div>

      {location ? (
        <>
          <div className="relative">
            <MapCanvas markers={markers} height={360} label="Nearby places map" />
            <div className="absolute left-3 top-3 glass rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-body">
              <Crosshair size={13} className="text-brand-400" /> {location.name} · GPS accuracy ±12m (demo)
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-5 py-1">
            {NEARBY_RADII.map((r) => (
              <button key={r.value} onClick={() => setRadius(r.value)} className={cn('shrink-0 rounded-full border px-4 py-2 text-sm', radius === r.value ? 'border-brand-500/50 bg-brand-500/10 text-body' : 'border-white/[0.08] bg-white/[0.03] text-muted hover:text-body')}>
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
            <button onClick={() => setCategory('all')} className={cn('shrink-0 rounded-full border px-4 py-2 text-sm', category === 'all' ? 'border-brand-500/50 bg-brand-500/10 text-body' : 'border-white/[0.08] text-muted')}>All</button>
            {NEARBY_CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={cn('shrink-0 rounded-full border px-4 py-2 text-sm capitalize', category === c ? 'border-brand-500/50 bg-brand-500/10 text-body' : 'border-white/[0.08] text-muted')}>{CATEGORY_LABELS[c] || c}</button>
            ))}
          </div>

          <div className="mt-6">
            {isLoading ? (
              <ListSkeleton rows={4} />
            ) : items.length === 0 ? (
              <p className="text-sm text-muted text-center py-10">Nothing found within {radius} km.</p>
            ) : (
              <div className="space-y-3">
                {items.map((p) => (
                  <div key={p.id} className="card p-4 flex items-center gap-4">
                    <img src={imageFor(p.imageSlug, 'hero')} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-body">{p.name}</h3>
                        <Badge tone={p.dataTrust === 'verified' ? 'live' : 'estimate'} label={CATEGORY_LABELS[p.category] || p.category} />
                      </div>
                      <p className="text-xs text-muted mt-0.5 flex items-center gap-2">
                        <Star size={11} className="text-warning" fill="currentColor" /> {p.rating} · {p.city}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-body">{formatKm(p.distanceMeters)}</p>
                      <p className="text-[11px] text-muted">away</p>
                    </div>
                    <button className="p-2.5 rounded-lg glass text-brand-400 hover:bg-white/[0.1]" aria-label="Navigate">
                      <Navigation size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card p-10 text-center max-w-md mx-auto mt-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-5">
            <LocateFixed size={28} className="text-brand-400" />
          </div>
          <h2 className="text-lg font-semibold text-body">Turn on location to see what's nearby</h2>
          <p className="text-sm text-muted mt-2">We only use your location after you allow it — never silently.</p>
          <div className="flex gap-3 justify-center mt-6">
            <Button icon={LocateFixed} onClick={useCurrentLocation} loading={locating}>Enable Location</Button>
            <Button variant="secondary" onClick={() => setLocation(SAMPLE)}>Use sample location</Button>
          </div>
        </div>
      )}
    </div>
  );
}
