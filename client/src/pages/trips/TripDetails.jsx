import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import TripHeader from '../../features/trips/components/TripHeader.jsx';
import TripStats from '../../features/trips/components/TripStats.jsx';
import TripTimeline from '../../features/trips/components/TripTimeline.jsx';
import TripMap from '../../features/maps/components/TripMap.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useTrip } from '../../features/trips/hooks/useTrip.js';
import { tripsApi } from '../../features/trips/trips.api.js';
import { expensesApi } from '../../features/expenses/expenses.api.js';
import { aiApi } from '../../features/ai/ai.api.js';
import { useQuery } from '@tanstack/react-query';
import { toast } from '../../store/ui.store.js';
import { inr } from '../../utils/currency.js';

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: trip, isLoading } = useTrip(tripId);
  const { data: summary } = useQuery({ queryKey: ['expense-summary', tripId], queryFn: () => expensesApi.summary(tripId), enabled: Boolean(tripId) });
  const [share, setShare] = useState(null);
  const [busy, setBusy] = useState('');

  const refresh = () => qc.invalidateQueries({ queryKey: ['trip', tripId] });

  const run = async (key, fn, okMsg) => {
    setBusy(key);
    try {
      await fn();
      await refresh();
      if (okMsg) toast(okMsg, 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'We hit a small roadblock.', 'error');
    } finally {
      setBusy('');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Skeleton className="h-24" />
        <Skeleton className="mt-4 h-64" />
      </DashboardLayout>
    );
  }
  if (!trip) {
    return (
      <DashboardLayout>
        <p>YatraGenie couldn't load this right now.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TripHeader
        trip={trip}
        onShare={async () => {
          const s = await tripsApi.share(tripId, 'view');
          setShare(s);
        }}
      />
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="relative h-48 bg-bg-elevated">
          <img src="/images/agra.jpg" alt="" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-2xl font-semibold">{trip.destination?.name}</p>
            <p className="text-sm text-ink-mute">
              ✨ {trip.aiSource === 'gemini' ? 'AI Optimized' : 'Catalog plan'} · {inr(trip.budget)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button loading={busy === 'opt'} onClick={() => run('opt', () => aiApi.optimize(tripId), 'AI is optimizing your route.')}>
          Optimize Trip
        </Button>
        <Button variant="secondary" loading={busy === 'route'} onClick={() => run('route', () => aiApi.route(tripId), 'Your route has been updated.')}>
          Optimize Route
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/trips/${tripId}/budget`)}>
          Budget
        </Button>
        <Button variant="secondary" onClick={() => navigate('/assistant')}>
          Ask AI
        </Button>
      </div>

      <div className="mt-6">
        <TripStats trip={trip} summary={summary} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <TripTimeline
          items={trip.itinerary}
          onRemove={async (item) => {
            await tripsApi.deleteItem(tripId, item._id);
            refresh();
            toast('Stop removed.', 'success');
          }}
        />
        <div className="space-y-4">
          <TripMap items={trip.itinerary} destination={trip.destination} className="h-80" />
          <div className="card p-4">
            <p className="text-sm font-medium">Stays</p>
            {(trip.hotels || []).map((h) => (
              <div key={h.name} className="mt-3 border-t border-white/5 pt-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>{h.name}</span>
                  <Badge trust={h.trust} />
                </div>
                <p className="text-ink-mute">{h.notes}</p>
              </div>
            ))}
            {!trip.hotels?.length && <p className="mt-2 text-sm text-ink-mute">No hotel needed or none planned.</p>}
          </div>
          <div className="card p-4">
            <p className="text-sm font-medium">Transport</p>
            {(trip.transport || []).map((t) => (
              <p key={t.mode} className="mt-2 text-sm text-ink-mute">
                {t.mode} · {t.notes} <Badge trust={t.trust} />
              </p>
            ))}
          </div>
          <Link to={`/trips/${tripId}/live`} className="block">
            <Button className="w-full">Start Journey</Button>
          </Link>
        </div>
      </div>

      <Modal open={Boolean(share)} title="Share your journey" onClose={() => setShare(null)}>
        <p className="text-sm text-ink-mute">View only. Private trips never use a guessable URL alone.</p>
        {share?.token && (
          <p className="mt-3 break-all rounded-md bg-bg-elevated p-3 text-xs">
            {window.location.origin}/trips/{tripId}/share/{share.token}
          </p>
        )}
      </Modal>
    </DashboardLayout>
  );
}
