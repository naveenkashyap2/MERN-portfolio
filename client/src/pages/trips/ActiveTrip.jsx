import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import TripMap from '../../features/maps/components/TripMap.jsx';
import LiveLocation from '../../features/location/components/LiveLocation.jsx';
import WalkingTracker from '../../features/location/components/WalkingTracker.jsx';
import ArrivalStatus from '../../features/location/components/ArrivalStatus.jsx';
import LocationPermission from '../../features/location/components/LocationPermission.jsx';
import { useTrip } from '../../features/trips/hooks/useTrip.js';
import { useGeolocation } from '../../features/location/hooks/useGeolocation.js';
import { useLocationTracking } from '../../features/location/hooks/useLocationTracking.js';
import { locationApi } from '../../features/location/location.api.js';
import { tripsApi } from '../../features/trips/trips.api.js';
import { toast } from '../../store/ui.store.js';
import { formatKm, formatMins, haversineKm, walkingEta } from '../../utils/distance.js';

export default function ActiveTrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { data: trip } = useTrip(tripId);
  const { locate } = useGeolocation();
  const [ask, setAsk] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [paused, setPaused] = useState(false);
  const { point } = useLocationTracking(paused ? null : sessionId);

  const nextStop = useMemo(() => trip?.itinerary?.find((i) => i.lat != null && i.category !== 'food'), [trip]);
  const dest = nextStop || trip?.destination;
  const remaining = point && dest?.lat != null ? haversineKm(point, dest) : null;
  const arrived = remaining != null && remaining * 1000 <= 100;

  const start = async () => {
    try {
      const here = await locate();
      const session = await locationApi.start({
        tripId,
        latitude: here.lat,
        longitude: here.lng,
        accuracy: here.accuracy,
        destination: dest,
        destinationRadius: 100,
      });
      await tripsApi.update(tripId, { status: 'active' });
      setSessionId(session.session.sessionId);
      setAsk(false);
      toast('Live trip started. Tracking is on for this session only.', 'success');
    } catch {
      toast('Location permission is required.', 'warning');
    }
  };

  const stop = async () => {
    if (sessionId) await locationApi.stop(sessionId);
    setSessionId(null);
    toast('Tracking stopped.', 'info');
  };

  return (
    <DashboardLayout>
      <p className="text-sm text-accent-cyan">You're on your journey 🚀</p>
      <h1 className="mt-1 text-3xl font-semibold">{trip ? `${trip.origin?.name} → ${trip.destination?.name}` : 'Live trip'}</h1>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TripMap items={trip?.itinerary || []} user={point} destination={dest} className="h-[50vh] min-h-72" />
        <div className="space-y-4">
          <LiveLocation
            here={point ? `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}` : 'Waiting for GPS'}
            next={nextStop?.title}
            distance={formatKm(remaining)}
            eta={formatMins(walkingEta(remaining))}
            progress={remaining == null ? 0 : Math.max(5, 100 - Math.round((remaining / 12) * 100))}
          />
          <WalkingTracker
            travelled={0}
            remaining={remaining || 0}
            eta={walkingEta(remaining)}
            onPause={() => setPaused((v) => !v)}
            onStop={stop}
          />
          <Button variant="danger" className="w-full" onClick={stop}>
            Stop Tracking
          </Button>
        </div>
      </div>

      <LocationPermission open={ask && !sessionId} onClose={() => setAsk(false)} onEnable={start} />
      <ArrivalStatus
        open={Boolean(sessionId && arrived)}
        place={nextStop?.title}
        onExplore={() => navigate('/explore')}
        onNext={() => toast('Head to the next stop when you are ready.', 'info')}
        onBreak={stop}
      />
    </DashboardLayout>
  );
}
