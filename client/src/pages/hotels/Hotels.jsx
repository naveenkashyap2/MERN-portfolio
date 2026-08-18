import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import HotelCard from '../../features/hotels/components/HotelCard.jsx';
import HotelFilters from '../../features/hotels/components/HotelFilters.jsx';
import HotelCategories from '../../features/hotels/components/HotelCategories.jsx';
import HotelComparison from '../../features/hotels/components/HotelComparison.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useHotels } from '../../features/hotels/hooks/useHotels.js';
import { profileApi } from '../../features/profile/profile.api.js';
import { toast } from '../../store/ui.store.js';

export default function Hotels() {
  const [city, setCity] = useState('Agra');
  const [category, setCategory] = useState('all');
  const { data, isLoading } = useHotels({ city, category: category === 'all' ? undefined : category });

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold">Hotels</h1>
      <p className="mt-1 text-sm text-ink-mute">Catalog stay areas. Live rooms are never invented.</p>
      <div className="mt-6 max-w-sm">
        <HotelFilters city={city} onCity={setCity} />
      </div>
      <div className="mt-4">
        <HotelCategories value={category} onChange={setCategory} />
      </div>
      <div className="mt-6">
        <HotelComparison items={data?.items || []} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {isLoading && <Skeleton className="h-40" />}
        {data?.items?.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onSave={async (h) => {
              await profileApi.addFavorite({ type: 'hotel', placeId: h.id, title: h.name, subtitle: h.city });
              toast('Saved.', 'success');
            }}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
