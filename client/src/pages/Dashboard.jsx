import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Hotel, TrainFront, Bot, LocateFixed, ArrowRight, CalendarDays, Wallet, Users } from 'lucide-react';
import { tripsApi, placesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { greeting, formatShortDate, formatDurationDays } from '../utils/date';
import { formatINR } from '../utils/currency';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import { imageFor } from '../constants/images';
import { QUICK_ACTIONS } from '../constants/app';

const QUICK_ICONS = { plan: MapPin, nearby: LocateFixed, hotels: Hotel, transport: TrainFront, ai: Bot };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: tripsData, isLoading: tripsLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripsApi.list(),
  });
  const { data: recData } = useQuery({
    queryKey: ['places-recommended'],
    queryFn: () => placesApi.category('recommended', { limit: 4 }),
  });

  const trips = tripsData?.trips || [];
  const upcoming = trips.find((t) => t.status === 'planned' || t.status === 'active');
  const recent = trips.filter((t) => t.id !== upcoming?.id).slice(0, 3);
  const recommendations = recData?.items || [];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted mt-1">Where are we going next?</p>
      </div>

      {/* Hero CTA + upcoming trip */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-white/[0.08] p-8 bg-hero-radial">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
          <Badge tone="ai" icon={Sparkles} label="AI Trip Planner" />
          <h2 className="text-2xl sm:text-3xl font-bold mt-4 max-w-md">Plan a trip from a single sentence.</h2>
          <p className="text-muted mt-2 max-w-md text-sm">Budget bolo — YatraGenie tumhare liye complete trip plan kare.</p>
          <Button className="mt-6" size="lg" icon={Sparkles} onClick={() => navigate('/plan')}>
            Plan My Trip
          </Button>
        </div>

        {tripsLoading ? (
          <CardSkeleton />
        ) : upcoming ? (
          <Link to={`/trips/${upcoming.id}`} className="card p-5 hover:border-brand-500/30 transition-colors block">
            <div className="flex items-center justify-between">
              <Badge tone="brand" label="Upcoming" />
              <ArrowRight size={16} className="text-muted" />
            </div>
            <h3 className="font-semibold text-body mt-4 flex items-center gap-1.5">
              <MapPin size={15} className="text-cyan" /> {upcoming.origin} → {upcoming.destination}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted">
              <span className="flex items-center gap-1"><CalendarDays size={13} /> {formatDurationDays(upcoming.startDate, upcoming.endDate)}</span>
              <span className="flex items-center gap-1"><Wallet size={13} /> {formatINR(upcoming.budget)}</span>
              <span className="flex items-center gap-1"><Users size={13} /> {(upcoming.travelers?.adults || 0) + (upcoming.travelers?.children || 0)}</span>
            </div>
            <p className="text-xs text-muted mt-3">{formatShortDate(upcoming.startDate)} · {upcoming.itinerary?.[0]?.items?.length || 0} stops planned</p>
          </Link>
        ) : (
          <Card className="p-5 flex flex-col items-center justify-center text-center">
            <Sparkles size={26} className="text-cyan mb-3" />
            <p className="font-medium text-body">No upcoming trip</p>
            <p className="text-sm text-muted mt-1">Create your first AI trip.</p>
            <Button size="sm" className="mt-4" onClick={() => navigate('/plan')}>Create AI Trip</Button>
          </Card>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {QUICK_ACTIONS.map((a) => {
          const Icon = QUICK_ICONS[a.id];
          return (
            <button key={a.id} onClick={() => navigate(a.to)} className="card p-4 text-left hover:border-brand-500/30 transition-colors group">
              <span className="w-10 h-10 rounded-xl bg-brand-500/12 border border-brand-500/20 flex items-center justify-center">
                <Icon size={18} className="text-brand-400" />
              </span>
              <p className="text-sm font-medium text-body mt-3">{a.label}</p>
              <ArrowRight size={14} className="text-muted mt-2 group-hover:translate-x-1 transition-transform" />
            </button>
          );
        })}
      </div>

      {/* AI recommendations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">AI recommendations for you</h2>
          <Link to="/explore" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Explore all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((p) => (
            <Link key={p.id} to="/explore" className="relative h-40 rounded-2xl overflow-hidden group">
              <img src={imageFor(p.imageSlug, 'hero')} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3">
                <p className="text-sm font-medium text-body truncate">{p.name}</p>
                <p className="text-[11px] text-muted">{p.city} · ★ {p.rating}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent trips */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent trips</h2>
            <Link to="/trips" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              All trips <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((t) => (
              <Link key={t.id} to={`/trips/${t.id}`} className="card p-4 hover:border-brand-500/30 transition-colors">
                <p className="font-medium text-body text-sm">{t.origin} → {t.destination}</p>
                <p className="text-xs text-muted mt-1">{formatShortDate(t.startDate)} – {formatShortDate(t.endDate)}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted">
                  <span className="flex items-center gap-1"><Wallet size={12} /> {formatINR(t.budget, true)}</span>
                  <Badge tone={t.status === 'completed' ? 'neutral' : 'brand'} label={t.status} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
