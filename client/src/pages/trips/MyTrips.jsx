import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Tabs from '../../components/ui/Tabs.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import TripCard from '../../features/trips/components/TripCard.jsx';
import { useTrips } from '../../features/trips/hooks/useTrips.js';
import { tripsApi } from '../../features/trips/trips.api.js';
import { toast } from '../../store/ui.store.js';

const STATUS = {
  upcoming: 'planned',
  active: 'active',
  completed: 'completed',
};

export default function MyTrips() {
  const [tab, setTab] = useState('upcoming');
  const [del, setDel] = useState(null);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useTrips({ status: STATUS[tab], limit: 20 });

  return (
    <DashboardLayout>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">My trips</h1>
          <p className="mt-1 text-sm text-ink-mute">Upcoming, live, and remembered journeys.</p>
        </div>
      </div>
      <div className="mt-6">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'active', label: 'Active' },
            { id: 'completed', label: 'Completed' },
          ]}
        />
      </div>
      <div className="mt-6 grid gap-4">
        {isLoading && <Skeleton className="h-28" />}
        {!isLoading && !data?.items?.length && (
          <EmptyState
            title="Your next adventure starts here."
            body="Create an AI trip from a budget, a city, or a Hinglish sentence."
            action="Create AI Trip"
            onAction={() => navigate('/plan')}
          />
        )}
        {data?.items?.map((trip) => (
          <TripCard
            key={trip._id}
            trip={trip}
            onDelete={setDel}
            onDuplicate={async (t) => {
              const copy = await tripsApi.duplicate(t._id);
              toast('Trip duplicated.', 'success');
              navigate(`/trips/${copy._id}`);
            }}
            onShare={async (t) => {
              await tripsApi.share(t._id, 'view');
              toast('Share link created.', 'success');
            }}
          />
        ))}
      </div>
      <ConfirmDialog
        open={Boolean(del)}
        title="Delete this trip?"
        body="This removes the itinerary and expenses for this trip."
        confirm="Delete Trip"
        danger
        onClose={() => setDel(null)}
        onConfirm={async () => {
          await tripsApi.remove(del._id);
          setDel(null);
          qc.invalidateQueries({ queryKey: ['trips'] });
          toast('Trip deleted.', 'success');
        }}
      />
    </DashboardLayout>
  );
}
