import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Tabs from '../../components/ui/Tabs.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { profileApi } from '../../features/profile/profile.api.js';

export default function Favorites() {
  const [tab, setTab] = useState('place');
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['favorites', tab], queryFn: () => profileApi.favorites({ type: tab === 'place' ? undefined : tab }) });

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold">Favorites</h1>
      <div className="mt-6">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'place', label: 'Places' },
            { id: 'hotel', label: 'Hotels' },
            { id: 'trip', label: 'Trips' },
          ]}
        />
      </div>
      <div className="mt-6 grid gap-3">
        {data?.items?.map((f) => (
          <div key={f._id} className="card flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{f.title}</p>
              <p className="text-xs text-ink-mute">{f.subtitle}</p>
            </div>
            <button
              type="button"
              className="text-xs text-red-300"
              onClick={async () => {
                await profileApi.removeFavorite(f._id);
                qc.invalidateQueries({ queryKey: ['favorites'] });
              }}
            >
              Remove
            </button>
          </div>
        ))}
        {!data?.items?.length && <EmptyState title="Save places you love." body="Heart a temple, stay area, or trip from Explore." />}
      </div>
    </DashboardLayout>
  );
}
