import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, LocateFixed, MapPin, Navigation, Clock, Pause, Play, Square, Footprints,
  CheckCircle2, X, Sparkles,
} from 'lucide-react';
import { tripsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import MapCanvas from '../components/maps/MapCanvas';
import Modal from '../components/ui/Modal';
import { ProgressRing } from '../components/ui/Progress';
import PageLoader from '../components/common/PageLoader';
import { formatKm, formatDurationMinutes } from '../utils/distance';

const CITY_COORDS = {
  'New Delhi': { lat: 28.6139, lng: 77.209 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Agra: { lat: 27.1767, lng: 78.0081 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Amritsar: { lat: 31.634, lng: 74.8723 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
};

export default function LiveTrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [permissionOpen, setPermissionOpen] = useState(false);
  const [mode, setMode] = useState('idle'); // idle | active | walking | arrived
  const [arrived, setArrived] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [position, setPosition] = useState(null);
  const [useSim, setUseSim] = useState(false);
  const watchRef = useRef(null);
  const timerRef = useRef(null);

  const { data, isLoading } = useQuery({ queryKey: ['trip', tripId], queryFn: () => tripsApi.get(tripId) });
  const trip = data?.trip;

  const stops = useMemo(() => {
    const items = trip?.itinerary?.flatMap((d) => d.items) || [];
    return items.filter((i) => i.coordinates);
  }, [trip]);

  const origin = CITY_COORDS[trip?.origin] || { lat: 28.6139, lng: 77.209 };
  const destination = stops[0]?.coordinates || CITY_COORDS[trip?.destination] || origin;
  const destName = stops[0]?.place || trip?.destination || 'your destination';

  const totalKm = useMemo(() => {
    // straight-line demo distance
    const R = 6371;
    const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
    const dLng = ((destination.lng - origin.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((origin.lat * Math.PI) / 180) * Math.cos((destination.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return Math.max(1, R * 2 * Math.asin(Math.sqrt(a)));
  }, [origin, destination]);

  const travelledKm = totalKm * progress;
  const remainingKm = Math.max(0, totalKm - travelledKm);
  const etaMinutes = Math.round((remainingKm / 4.5) * 60);

  const startTracking = (simulate) => {
    setUseSim(simulate);
    setPermissionOpen(false);
    setMode('walking');
    setProgress(0);
    setPosition({ ...origin });

    if (simulate) {
      toast.info('Demo tracking started — using simulated GPS.');
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 0.02;
          if (next >= 1) {
            clearInterval(timerRef.current);
            setArrived(true);
            setMode('arrived');
            return 1;
          }
          return next;
        });
      }, 700);
    } else if (navigator.geolocation) {
      toast.success('Live tracking started.');
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          // estimate progress toward destination
          const d = haversine(pos.coords.latitude, pos.coords.longitude, destination.lat, destination.lng);
          const total = haversine(origin.lat, origin.lng, destination.lat, destination.lng);
          const p = Math.max(0, Math.min(1, 1 - d / Math.max(0.1, total)));
          setProgress(p);
          if (p >= 0.98) {
            setArrived(true);
            setMode('arrived');
          }
        },
        () => toast.warning('Location permission denied. Try demo tracking instead.'),
        { enableHighAccuracy: true },
      );
    } else {
      startTracking(true);
    }
  };

  const stopTracking = () => {
    clearInterval(timerRef.current);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    setMode('idle');
    toast.info('Tracking stopped.');
  };

  useEffect(() => () => {
    clearInterval(timerRef.current);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
  }, []);

  if (isLoading) return <PageLoader />;
  if (!trip) return <PageLoader />;

  const markers = [
    { id: 'user', lat: position?.lat || origin.lat, lng: position?.lng || origin.lng, kind: 'user', color: '#3B82F6', label: 'You' },
    { id: 'dest', lat: destination.lat, lng: destination.lng, kind: 'destination', color: '#22C55E', label: destName },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ height: '100vh' }}>
      {/* Top bar */}
      <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
        <button onClick={() => navigate(`/trips/${tripId}`)} className="flex items-center gap-2 text-sm text-muted hover:text-body">
          <ArrowLeft size={17} /> Exit
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-body">You're on your journey 🚀</span>
          <Badge tone="live" label="Live Trip" />
        </div>
        {mode !== 'idle' ? (
          <Button size="sm" variant="danger" icon={Square} onClick={stopTracking}>Stop Tracking</Button>
        ) : (
          <div className="w-20" />
        )}
      </header>

      {/* Map */}
      <div className="flex-1 relative min-h-[40vh]">
        <MapCanvas markers={markers} height="100%" className="rounded-none" label="Live trip map" />
        {useSim && mode !== 'idle' && (
          <div className="absolute right-3 bottom-3 glass rounded-lg px-2.5 py-1.5 text-[11px] text-muted flex items-center gap-1.5">
            <Sparkles size={12} className="text-cyan" /> Demo GPS simulation
          </div>
        )}
      </div>

      {/* Bottom sheet */}
      <div className="shrink-0 glass border-t border-white/[0.08] px-4 sm:px-6 py-4">
        {mode === 'idle' ? (
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center"><LocateFixed size={20} className="text-brand-400" /></span>
              <div>
                <p className="font-medium text-body">Next stop: {destName}</p>
                <p className="text-xs text-muted">Distance: {formatKm(totalKm * 1000)} · ETA: {formatDurationMinutes(etaMinutes)}</p>
              </div>
            </div>
            <Button icon={Play} onClick={() => setPermissionOpen(true)}>Start Journey</Button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto grid grid-cols-3 gap-4 items-center">
            <LiveStat icon={MapPin} label="You are here" value={useSim ? 'Demo route' : 'GPS locked'} />
            <div className="flex flex-col items-center">
              <ProgressRing value={travelledKm} max={totalKm} size={96} label="progress" />
            </div>
            <LiveStat icon={Navigation} label="Next" value={destName} sub={`${formatKm(remainingKm * 1000)} · ${formatDurationMinutes(etaMinutes)}`} />
          </div>
        )}
      </div>

      {/* Permission modal */}
      <Modal open={permissionOpen} onClose={() => setPermissionOpen(false)} title="Turn on location to unlock Live Trip Mode" hideClose>
        <div className="space-y-3 text-sm text-body">
          {['Live distance', 'Walking progress', 'Arrival detection', 'Better route guidance'].map((b) => (
            <p key={b} className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-success" /> {b}</p>
          ))}
          <p className="text-xs text-muted pt-1">We never track you without consent. Location is used only while Live Trip Mode is active.</p>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <Button icon={LocateFixed} onClick={() => startTracking(false)}>Enable Location</Button>
          <Button variant="secondary" icon={Footprints} onClick={() => startTracking(true)}>Try demo (simulated)</Button>
          <Button variant="ghost" onClick={() => setPermissionOpen(false)}>Maybe Later</Button>
        </div>
      </Modal>

      {/* Arrival */}
      <AnimatePresence>
        {arrived && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="card p-10 text-center max-w-md w-full">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="w-20 h-20 rounded-full bg-success/15 border border-success/40 flex items-center justify-center mx-auto">
                <CheckCircle2 size={42} className="text-success" />
              </motion.div>
              <h2 className="text-2xl font-bold mt-6">You've arrived!</h2>
              <p className="text-muted mt-2">Welcome to {destName}.</p>
              <div className="flex flex-col gap-2 mt-8">
                <Button icon={Sparkles} onClick={() => { setArrived(false); setMode('idle'); }}>Explore Place</Button>
                <Button variant="secondary" onClick={() => { setArrived(false); setMode('idle'); }}>Next Stop</Button>
                <Button variant="ghost" onClick={() => { setArrived(false); setMode('idle'); }}>Take a Break</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LiveStat({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0"><Icon size={16} className="text-cyan" /></span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted">{label}</p>
        <p className="text-sm font-medium text-body truncate">{value}</p>
        {sub && <p className="text-[11px] text-muted">{sub}</p>}
      </div>
    </div>
  );
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}
