import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Train, Bus, GitCompareArrows, Search, Zap, Wallet, Crown, Sparkles } from 'lucide-react';
import { transportApi } from '../services/api';
import Tabs from '../components/ui/Tabs';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import TransportCard from '../components/travel/TransportCard';
import { ListSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { formatINR } from '../utils/currency';
import { formatDurationMinutes } from '../utils/distance';

export default function Transport() {
  const [tab, setTab] = useState('train');
  const [from, setFrom] = useState('New Delhi');
  const [to, setTo] = useState('Agra');
  const [submitted, setSubmitted] = useState({ from: 'New Delhi', to: 'Agra' });

  const trainQuery = useQuery({
    queryKey: ['trains', submitted.from, submitted.to],
    queryFn: () => transportApi.searchTrains({ from: submitted.from, to: submitted.to }),
    enabled: tab === 'train',
  });
  const busQuery = useQuery({
    queryKey: ['buses', submitted.from, submitted.to],
    queryFn: () => transportApi.searchBuses({ from: submitted.from, to: submitted.to }),
    enabled: tab === 'bus',
  });
  const compareQuery = useQuery({
    queryKey: ['transport-compare', submitted.from, submitted.to],
    queryFn: () => transportApi.compare({ from: submitted.from, to: submitted.to }),
    enabled: tab === 'compare',
  });

  const search = (e) => {
    e.preventDefault();
    setSubmitted({ from, to });
  };

  const data = tab === 'train' ? trainQuery.data : tab === 'bus' ? busQuery.data : null;
  const loading = tab === 'train' ? trainQuery.isLoading : tab === 'bus' ? busQuery.isLoading : compareQuery.isLoading;
  const items = data?.items || [];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold">Transport</h1>
      <p className="text-muted mt-1 text-sm">Trains, buses and smarter ways to get there.</p>

      <form onSubmit={search} className="grid sm:grid-cols-4 gap-3 mt-6">
        <Input label="From" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="New Delhi" />
        <Input label="To" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Agra" />
        <Input label="Date" type="date" />
        <div className="flex items-end">
          <Button type="submit" className="w-full" icon={Search}>Search</Button>
        </div>
      </form>

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'train', label: 'Train', icon: Train },
          { value: 'bus', label: 'Bus', icon: Bus },
          { value: 'compare', label: 'Compare', icon: GitCompareArrows },
        ]}
      />

      <div className="mt-6">
        {tab === 'compare' ? (
          <CompareView data={compareQuery.data} />
        ) : loading ? (
          <ListSkeleton rows={4} />
        ) : items.length === 0 ? (
          <EmptyState icon={Train} title="Nothing here yet." description="No estimated schedules found for this route." />
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted flex items-center gap-1.5">
              <Badge tone="estimate" label="Estimates" /> Live availability requires a verified provider — we never fake real-time data.
            </p>
            {items.map((item) => (
              <TransportCard key={item.id} item={item} kind={tab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompareView({ data }) {
  if (!data) return <ListSkeleton rows={3} />;
  const icons = { train: Zap, bus: Wallet, car: Crown };
  return (
    <div>
      <p className="text-xs text-muted mb-4">Corridor: <span className="text-body">{data.corridor}</span> · <Badge tone="estimate" label="Estimates" /></p>
      <div className="grid sm:grid-cols-3 gap-4">
        {data.options.map((o, i) => {
          const Icon = icons[o.mode] || Sparkles;
          return (
            <div key={o.mode} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="w-11 h-11 rounded-xl bg-brand-500/12 border border-brand-500/20 flex items-center justify-center"><Icon size={20} className="text-brand-400" /></span>
                {i === 0 && <Badge tone="ai" icon={Sparkles} label="AI Pick" />}
              </div>
              <h3 className="font-semibold text-body mt-4 uppercase">{o.label}</h3>
              <p className="text-xs text-muted mt-0.5">{o.note}</p>
              <div className="mt-4 space-y-1.5">
                <p className="text-sm text-body"><span className="text-muted text-xs">Duration: </span>{formatDurationMinutes(o.durationMin)}</p>
                <p className="text-sm text-body"><span className="text-muted text-xs">Fare: </span>{formatINR(o.fare)}</p>
              </div>
              <p className="text-[11px] text-cyan mt-3">{o.recommended}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
