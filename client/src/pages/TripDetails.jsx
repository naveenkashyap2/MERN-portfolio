import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, CalendarDays, Users, Wallet, Sparkles, Play, Pencil, Share2, Trash2, Copy,
  MapPin, Route as RouteIcon, Bot, Check, X, Navigation, Plus, Link as LinkIcon, MessageCircle, Mail,
} from 'lucide-react';
import { tripsApi, itineraryApi, expensesApi, aiApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/common/ConfirmDialog';
import MapCanvas from '../components/maps/MapCanvas';
import ItineraryCard from '../components/travel/ItineraryCard';
import AIChatBox from '../components/ai/AIChatBox';
import ExpenseChart from '../components/charts/ExpenseChart';
import { ProgressBar } from '../components/ui/Progress';
import ErrorState from '../components/ui/ErrorState';
import PageLoader from '../components/common/PageLoader';
import Dropdown, { DropdownItem } from '../components/ui/Dropdown';
import { imageFor } from '../constants/images';
import { formatINR } from '../utils/currency';
import { formatDurationDays, formatShortDate } from '../utils/date';
import { cn } from '../utils/cn';

const CITY_COORDS = {
  'New Delhi': { lat: 28.6139, lng: 77.209 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Agra: { lat: 27.1767, lng: 78.0081 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Amritsar: { lat: 31.634, lng: 74.8723 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
};

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [activeDay, setActiveDay] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripsApi.get(tripId),
  });

  const { data: budgetData } = useQuery({
    queryKey: ['expense-summary', tripId],
    queryFn: () => expensesApi.summary(tripId),
  });

  const trip = data?.trip;

  const days = trip?.itinerary || [];
  const currentDay = days[Math.min(activeDay, days.length - 1)] || days[0];

  const removeItem = useMutation({
    mutationFn: (itemId) => itineraryApi.remove(tripId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      toast.success('Item removed.');
    },
  });

  const optimizeRoute = useMutation({
    mutationFn: () => aiApi.routeOptimize(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      toast.success('Your route has been updated.');
    },
  });

  const saveTrip = useMutation({
    mutationFn: (payload) => tripsApi.update(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip updated successfully.');
      setEditOpen(false);
    },
  });

  const saveItem = useMutation({
    mutationFn: (payload) => itineraryApi.update(tripId, editItem.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      toast.success('Stop updated.');
      setEditItem(null);
    },
  });

  const removeTrip = useMutation({
    mutationFn: () => tripsApi.remove(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip deleted.');
      navigate('/trips');
    },
  });

  const shareTrip = useMutation({
    mutationFn: () => tripsApi.share(tripId),
    onSuccess: (res) => setShareData({ ...res, link: `${window.location.origin}/trips/${res.trip.id}` }),
  });

  const mapMarkers = useMemo(() => {
    if (!currentDay) return [];
    const pts = currentDay.items.filter((i) => i.coordinates).map((i) => ({ id: i.id, lat: i.coordinates.lat, lng: i.coordinates.lng, label: i.place }));
    const origin = CITY_COORDS[trip?.origin] && [CITY_COORDS[trip.origin]];
    const dest = CITY_COORDS[trip?.destination] && [CITY_COORDS[trip.destination]];
    return [...(origin || []).map((c, i) => ({ id: 'origin', ...c, color: '#3B82F6', kind: 'user' })), ...pts.map((p) => ({ ...p, color: '#94A3B8' })), ...(dest || []).map((c) => ({ id: 'dest', ...c, color: '#22C55E', kind: 'destination' }))];
  }, [currentDay, trip]);

  if (isLoading) return <PageLoader />;
  if (isError || !trip) {
    return (
      <ErrorState title="We couldn't find that trip." description="It may have been deleted or the link is incorrect." onRetry={refetch} onBack={() => navigate('/trips')} />
    );
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareData.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-6">
      <Link to="/trips" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body">
        <ArrowLeft size={15} /> My Trips
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <MapPin size={24} className="text-cyan" /> {trip.origin} → {trip.destination}
            </h1>
            {trip.aiGenerated && <Badge tone="ai" icon={Sparkles} label="AI Optimized" />}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-sm text-muted">
            <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDurationDays(trip.startDate, trip.endDate)}</span>
            <span className="flex items-center gap-1.5"><Users size={14} /> {(trip.travelers?.adults || 0) + (trip.travelers?.children || 0)} Travelers</span>
            <span className="flex items-center gap-1.5"><Wallet size={14} /> {formatINR(trip.budget)} Budget</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button icon={Play} onClick={() => navigate(`/trips/${trip.id}/live`)}>Start Trip</Button>
          <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>Edit</Button>
          <Button variant="secondary" icon={Share2} onClick={() => shareTrip.mutate()} loading={shareTrip.isPending}>Share</Button>
          <Dropdown trigger={<Button variant="secondary" icon={Copy}>More</Button>}>
            <DropdownItem icon={Copy} onClick={() => tripsApi.duplicate(tripId).then(() => { queryClient.invalidateQueries({ queryKey: ['trips'] }); toast.success('Trip duplicated.'); })}>Duplicate</DropdownItem>
            <DropdownItem icon={Trash2} danger onClick={() => setDeleteOpen(true)}>Delete</DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Hero card */}
      <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden">
        <img src={imageFor(days[0]?.items?.find((i) => i.imageSlug)?.imageSlug || 'hero', 'hero')} alt={trip.destination} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-3xl font-bold">{trip.destination}</h2>
            <p className="text-sm text-muted mt-1 flex items-center gap-3">
              <span>{formatDurationDays(trip.startDate, trip.endDate)}</span>
              <span>•</span>
              <span>AI Optimized</span>
              <span>•</span>
              <span>{formatINR(trip.budget)}</span>
            </p>
          </div>
          <Button icon={Play} onClick={() => navigate(`/trips/${trip.id}/live`)}>Start Journey</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: itinerary + map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-semibold text-body flex items-center gap-2"><RouteIcon size={17} className="text-cyan" /> Route</h3>
              <Badge tone="estimate" label="Estimated" />
            </div>
            <MapCanvas markers={mapMarkers} height={320} label={`${trip.origin} to ${trip.destination} route`} />
          </Card>

          {/* Itinerary */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h3 className="font-semibold text-body text-lg">Itinerary</h3>
              <Button variant="secondary" size="sm" icon={Sparkles} loading={optimizeRoute.isPending} onClick={() => optimizeRoute.mutate()}>
                AI Optimize Route
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
              {days.map((d, i) => (
                <button key={d.id || d.day} onClick={() => setActiveDay(i)} className={cn('shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-colors', i === activeDay ? 'border-brand-500/50 bg-brand-500/10 text-body' : 'border-white/[0.08] bg-white/[0.03] text-muted hover:text-body')}>
                  Day {d.day}
                </button>
              ))}
            </div>

            {currentDay ? (
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-body">{currentDay.title || `Day ${currentDay.day}`}</h4>
                  {currentDay.summary && <p className="text-xs text-muted mt-0.5">{currentDay.summary}</p>}
                </div>
                {currentDay.items.map((item) => (
                  <ItineraryCard
                    key={item.id}
                    item={item}
                    onEdit={() => setEditItem(item)}
                    onRemove={() => removeItem.mutate(item.id)}
                    onNavigate={() => toast.info('Live navigation starts in Live Trip mode.')}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No itinerary yet.</p>
            )}
          </div>
        </div>

        {/* Right: budget + AI + stays */}
        <div className="space-y-6">
          <BudgetOverview trip={trip} budgetData={budgetData} />

          <Card className="p-5">
            <h3 className="font-semibold text-body flex items-center gap-2 mb-4"><Bot size={17} className="text-cyan" /> YatraGenie AI</h3>
            <div className="h-[420px]">
              <AIChatBox tripId={trip.id} />
            </div>
          </Card>

          {trip.hotels?.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-body mb-4">Suggested stays</h3>
              <div className="space-y-3">
                {trip.hotels.slice(0, 3).map((h) => (
                  <div key={h.name || h.id} className="flex items-center gap-3">
                    <img src={imageFor(h.imageSlug, 'hotel')} alt={h.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-body truncate">{h.name}</p>
                      <p className="text-xs text-muted">{h.category} · {h.rating || '—'}★</p>
                    </div>
                    {h.pricePerNight && <p className="text-sm text-body font-medium">{formatINR(h.pricePerNight)}</p>}
                  </div>
                ))}
              </div>
              <Badge tone="estimate" label="Estimated prices" className="mt-4" />
            </Card>
          )}
        </div>
      </div>

      {/* Edit trip modal */}
      <EditTripModal open={editOpen} onClose={() => setEditOpen(false)} trip={trip} saving={saveTrip.isPending} onSave={(p) => saveTrip.mutate(p)} />

      {/* Edit item modal */}
      <EditItemModal item={editItem} onClose={() => setEditItem(null)} saving={saveItem.isPending} onSave={(p) => saveItem.mutate(p)} />

      {/* Share modal */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share your journey" subtitle="View only — private data stays private.">
        {shareData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 truncate rounded-xl bg-ink-800 border border-white/10 px-3 py-2.5 text-sm text-muted">{shareData.link}</div>
              <Button size="sm" variant="secondary" icon={copied ? Check : LinkIcon} onClick={copyLink}>{copied ? 'Copied' : 'Copy'}</Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={`https://wa.me/?text=${encodeURIComponent(`Check out my trip: ${shareData.link}`)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-body hover:bg-white/[0.08]"><MessageCircle size={15} className="text-success" /> WhatsApp</a>
              <a href={`mailto:?subject=My trip&body=${encodeURIComponent(shareData.link)}`} className="flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-body hover:bg-white/[0.08]"><Mail size={15} className="text-brand-400" /> Email</a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => removeTrip.mutate()}
        loading={removeTrip.isPending}
        title="Delete this trip?"
        description={`"${trip.title}" and its expenses will be permanently removed.`}
        confirmLabel="Delete Trip"
      />
    </div>
  );
}

function BudgetOverview({ trip, budgetData }) {
  const navigate = useNavigate();
  const summary = budgetData || { budget: trip.budget, spent: 0, remaining: trip.budget, byCategory: {} };
  const pct = summary.budget > 0 ? Math.round((summary.spent / summary.budget) * 100) : 0;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-body">Budget overview</h3>
        <button onClick={() => navigate(`/trips/${trip.id}/budget`)} className="text-xs text-brand-400 hover:text-brand-300">Details →</button>
      </div>
      <div className="flex items-end justify-between mt-4">
        <div>
          <p className="text-[11px] text-muted">Spent</p>
          <p className="text-xl font-bold text-body">{formatINR(summary.spent)}</p>
        </div>
        <p className="text-xs text-muted">of {formatINR(summary.budget)}</p>
      </div>
      <ProgressBar value={summary.spent} max={summary.budget} tone={pct >= 80 ? 'warning' : 'brand'} className="mt-3" />
      <p className="text-xs text-muted mt-2 flex items-center justify-between">
        <span>{formatINR(summary.remaining)} remaining</span>
        {summary.warning && <span className="text-warning">{summary.warning}</span>}
      </p>
      <div className="h-[150px] mt-3">
        <ExpenseChart data={summary.byCategory} height={150} />
      </div>
    </Card>
  );
}

function EditTripModal({ open, onClose, trip, saving, onSave }) {
  const [form, setForm] = useState({});
  const [ready, setReady] = useState(false);

  // sync once when opened
  if (open && !ready) {
    setForm({ title: trip.title, budget: trip.budget, startDate: trip.startDate, endDate: trip.endDate, status: trip.status });
    setReady(true);
  }
  const close = () => { setReady(false); onClose(); };

  return (
    <Modal open={open} onClose={close} title="Edit trip" footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={() => onSave(form)} loading={saving} icon={Check}>Save changes</Button></>}>
      <div className="space-y-4">
        <Input label="Title" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Start date" type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <Input label="End date" type="date" value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
        <Input label="Budget (₹)" type="number" value={form.budget || ''} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
        <div>
          <label className="block text-sm font-medium text-body mb-1.5">Status</label>
          <div className="flex gap-2">
            {['planned', 'active', 'completed'].map((s) => (
              <button key={s} onClick={() => setForm({ ...form, status: s })} className={cn('flex-1 rounded-xl border px-3 py-2 text-sm capitalize', form.status === s ? 'border-brand-500/50 bg-brand-500/10 text-body' : 'border-white/[0.08] bg-white/[0.03] text-muted')}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function EditItemModal({ item, onClose, saving, onSave }) {
  const [form, setForm] = useState({});
  const [ready, setReady] = useState(false);
  if (item && !ready) {
    setForm({ place: item.place, time: item.time, duration: item.duration, cost: item.cost, notes: item.notes || '' });
    setReady(true);
  }
  const close = () => { setReady(false); onClose(); };

  return (
    <Modal open={Boolean(item)} onClose={close} title="Edit stop" footer={<><Button variant="secondary" onClick={close}><X size={15} /> Cancel</Button><Button onClick={() => onSave(form)} loading={saving} icon={Check}>Save</Button></>}>
      <div className="space-y-4">
        <Input label="Place" value={form.place || ''} onChange={(e) => setForm({ ...form, place: e.target.value })} />
        <div className="grid grid-cols-3 gap-3">
          <Input label="Time" value={form.time || ''} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <Input label="Duration" value={form.duration || ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <Input label="Cost (₹)" type="number" value={form.cost || ''} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
        </div>
        <Input label="Notes" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>
    </Modal>
  );
}
