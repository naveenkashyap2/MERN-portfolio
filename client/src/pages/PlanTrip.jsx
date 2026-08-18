import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, CalendarDays, Users, Wallet, Train, Sparkles, ArrowRight, ArrowLeft, ArrowUpDown, LocateFixed,
  Plus, Minus, Check, Bot,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Slider from '../components/ui/Slider';
import AIGenerationScreen from '../components/ai/AIGenerationScreen';
import { aiApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../lib/axios';
import { TRANSPORT_OPTIONS, STAY_OPTIONS, INTERESTS } from '../constants/trip';
import { BUDGET_MARKS } from '../constants/app';
import { formatINR } from '../utils/currency';
import { tripDuration } from '../utils/date';
import { cn } from '../utils/cn';

const STEPS = [
  { n: 1, label: 'Destination' },
  { n: 2, label: 'Dates' },
  { n: 3, label: 'Travelers' },
  { n: 4, label: 'Budget' },
  { n: 5, label: 'Transport' },
  { n: 6, label: 'Stay' },
  { n: 7, label: 'Interests' },
];

function budgetLevel(budget) {
  if (budget < 5000) return 'Budget';
  if (budget < 15000) return 'Comfort';
  return 'Premium';
}

export default function PlanTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [genDestination, setGenDestination] = useState('');
  const [nlText, setNlText] = useState(location.state?.prompt || '');

  const [form, setForm] = useState({
    origin: 'Delhi',
    destination: 'Agra',
    startDate: '',
    endDate: '',
    travelers: { adults: 2, children: 0 },
    budget: 5000,
    transportPreference: 'train',
    stayPreference: 'medium',
    interests: ['historical', 'food'],
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const duration = tripDuration(form.startDate, form.endDate);
  const today = new Date().toISOString().split('T')[0];

  const valid = useMemo(() => {
    switch (step) {
      case 0: return form.origin.trim() && form.destination.trim();
      case 1: return Boolean(form.startDate && form.endDate);
      case 2: return form.travelers.adults >= 1;
      default: return true;
    }
  }, [step, form]);

  const swapLocations = () => setForm((f) => ({ ...f, origin: f.destination, destination: f.origin }));

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.warning('Location is not available in this browser.');
      return;
    }
    toast.info('Locating…');
    navigator.geolocation.getCurrentPosition(
      () => {
        toast.success('Location detected — set to New Delhi.');
        set('origin', 'Delhi');
      },
      () => toast.warning('Location permission denied. You can type your origin instead.'),
      { timeout: 8000 },
    );
  };

  const generate = async (payload) => {
    setGenerating(true);
    setGenDestination(payload.destination);
    try {
      const res = await aiApi.generate(payload);
      toast.success('Your trip is ready!');
      setTimeout(() => navigate(`/trips/${res.trip.id}`), 1200);
    } catch (err) {
      setGenerating(false);
      toast.error(getErrorMessage(err, 'We hit a small roadblock.'));
    }
  };

  const handleGenerate = () => generate({
    origin: form.origin,
    destination: form.destination,
    startDate: form.startDate,
    endDate: form.endDate,
    travelers: form.travelers,
    budget: form.budget,
    transportPreference: form.transportPreference,
    stayPreference: form.stayPreference,
    interests: form.interests,
  });

  const handleNaturalLanguage = async () => {
    if (nlText.trim().length < 3) {
      toast.warning('Tell me a bit more about your trip first.');
      return;
    }
    setGenerating(true);
    setGenDestination('your destination');
    try {
      const res = await aiApi.naturalLanguage(nlText.trim());
      toast.success('I understood! Building your trip…');
      setTimeout(() => navigate(`/trips/${res.trip.id}`), 1200);
    } catch (err) {
      setGenerating(false);
      toast.error(getErrorMessage(err));
    }
  };

  if (generating) {
    return <AIGenerationScreen destination={genDestination} onComplete={() => {}} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Plan your trip</h1>
          <p className="text-muted mt-1 text-sm">A few quick steps and AI does the rest.</p>
        </div>
        <Badge tone="ai" icon={Sparkles} label="AI Planner" />
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mb-8">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center shrink-0">
            <button
              onClick={() => setStep(i)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                i === step ? 'bg-brand-500/15 text-brand-400' : i < step ? 'text-body' : 'text-muted',
              )}
            >
              <span className={cn('w-5 h-5 rounded-full text-[10px] flex items-center justify-center border', i < step ? 'bg-success/20 border-success/40 text-success' : i === step ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/15')}>
                {i < step ? <Check size={11} /> : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <span className="w-4 h-px bg-white/10 shrink-0" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              {step === 0 && <DestinationStep form={form} set={set} swapLocations={swapLocations} useCurrentLocation={useCurrentLocation} />}
              {step === 1 && <DatesStep form={form} set={set} today={today} />}
              {step === 2 && <TravelersStep form={form} set={set} />}
              {step === 3 && <BudgetStep form={form} set={set} />}
              {step === 4 && <TransportStep form={form} set={set} />}
              {step === 5 && <StayStep form={form} set={set} />}
              {step === 6 && <InterestsStep form={form} set={set} />}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < 6 ? (
              <Button iconRight={ArrowRight} onClick={() => setStep((s) => Math.min(6, s + 1))} disabled={!valid}>
                Continue
              </Button>
            ) : (
              <Button icon={Sparkles} size="lg" onClick={handleGenerate}>
                Generate My Trip ✨
              </Button>
            )}
          </div>
        </div>

        {/* Live summary */}
        <div className="lg:col-span-2">
          <SummaryCard form={form} duration={duration} step={step} />
          <div className="mt-4 card p-5">
            <p className="text-sm font-medium text-body flex items-center gap-1.5 mb-2.5"><Bot size={15} className="text-cyan" /> Or just tell YatraGenie…</p>
            <textarea
              rows={2}
              value={nlText}
              onChange={(e) => setNlText(e.target.value)}
              placeholder="Delhi se Agra 2 din, budget 5000, train, Taj Mahal aur temples…"
              className="w-full rounded-xl bg-ink-800/70 border border-white/10 px-3.5 py-2.5 text-sm text-body placeholder:text-muted/60 focus:border-cyan/60 resize-none"
            />
            <Button className="mt-2 w-full" variant="cyan" icon={Bot} onClick={handleNaturalLanguage}>
              Plan with AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ steps ------------------------------ */
function DestinationStep({ form, set, swapLocations, useCurrentLocation }) {
  return (
    <div className="space-y-4">
      <Input label="From" icon={MapPin} placeholder="Delhi" value={form.origin} onChange={(e) => set('origin', e.target.value)} />
      <div className="relative">
        <Input label="To" icon={MapPin} placeholder="Agra" value={form.destination} onChange={(e) => set('destination', e.target.value)} />
        <button onClick={swapLocations} aria-label="Swap locations" className="absolute right-3 top-[38px] w-8 h-8 rounded-lg bg-ink-800 border border-white/10 flex items-center justify-center text-muted hover:text-body hover:border-brand-400/50 transition-colors">
          <ArrowUpDown size={15} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" icon={LocateFixed} onClick={useCurrentLocation}>Use my location</Button>
        <Button variant="ghost" size="sm" onClick={() => set('destination', 'Jaipur')}>Jaipur</Button>
        <Button variant="ghost" size="sm" onClick={() => set('destination', 'Varanasi')}>Varanasi</Button>
        <Button variant="ghost" size="sm" onClick={() => set('destination', 'Amritsar')}>Amritsar</Button>
      </div>
    </div>
  );
}

function DatesStep({ form, set, today }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Start date" type="date" min={today} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
        <Input label="End date" type="date" min={form.startDate || today} value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
      </div>
      {form.startDate && form.endDate && (
        <div className="rounded-xl bg-brand-500/[0.07] border border-brand-500/20 px-4 py-3 flex items-center gap-3">
          <CalendarDays size={18} className="text-brand-400" />
          <p className="text-sm text-body font-medium">
            {new Date(form.endDate) >= new Date(form.startDate) ? `${Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1} Days / ${Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000)} Nights` : 'End date must be after start date.'}
          </p>
        </div>
      )}
    </div>
  );
}

function TravelersStep({ form, set }) {
  const update = (key, delta) => {
    const next = Math.max(key === 'adults' ? 1 : 0, form.travelers[key] + delta);
    set('travelers', { ...form.travelers, [key]: next });
  };
  return (
    <div className="space-y-4">
      <Counter label="Adults" value={form.travelers.adults} onChange={(d) => update('adults', d)} />
      <Counter label="Children" value={form.travelers.children} onChange={(d) => update('children', d)} />
      <p className="text-sm text-body font-medium flex items-center gap-2"><Users size={16} className="text-cyan" /> {form.travelers.adults + form.travelers.children} Travelers</p>
    </div>
  );
}

function Counter({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-ink-800/60 border border-white/10 px-4 py-3.5">
      <span className="text-sm font-medium text-body">{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(-1)} className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 text-body hover:bg-white/[0.1]" aria-label={`Decrease ${label}`}><Minus size={15} /></button>
        <span className="text-lg font-semibold text-body w-6 text-center">{value}</span>
        <button onClick={() => onChange(1)} className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 text-body hover:bg-white/[0.1]" aria-label={`Increase ${label}`}><Plus size={15} /></button>
      </div>
    </div>
  );
}

function BudgetStep({ form, set }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted">Total budget</span>
          <span className="text-2xl font-bold text-body">{formatINR(form.budget)}</span>
        </div>
        <Slider value={form.budget} min={1000} max={50000} step={500} onChange={(v) => set('budget', v)} marks={BUDGET_MARKS} />
      </div>
      <div className="flex items-center gap-3">
        <Input label="Custom budget" type="number" min={1000} value={form.budget} onChange={(e) => set('budget', Number(e.target.value) || 1000)} />
        <div className="pt-6">
          <Badge tone="brand" label={budgetLevel(form.budget)} />
        </div>
      </div>
      <div className="flex gap-2">
        {[{ l: 'Budget', v: 3000 }, { l: 'Comfort', v: 8000 }, { l: 'Premium', v: 20000 }].map((o) => (
          <button key={o.l} onClick={() => set('budget', o.v)} className={cn('flex-1 rounded-xl border px-3 py-2.5 text-sm', form.budget === o.v ? 'border-brand-500/50 bg-brand-500/10 text-body' : 'border-white/[0.08] bg-white/[0.03] text-muted hover:text-body')}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function TransportStep({ form, set }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TRANSPORT_OPTIONS.map((o) => (
        <OptionCard key={o.value} icon={o.icon} title={o.label} description={o.description} active={form.transportPreference === o.value} onClick={() => set('transportPreference', o.value)} />
      ))}
    </div>
  );
}

function StayStep({ form, set }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {STAY_OPTIONS.map((o) => (
        <OptionCard key={o.value} icon={o.icon} title={o.label} description={o.description} badge={o.price} active={form.stayPreference === o.value} onClick={() => set('stayPreference', o.value)} />
      ))}
    </div>
  );
}

function InterestsStep({ form, set }) {
  const toggle = (i) => {
    const has = form.interests.includes(i);
    set('interests', has ? form.interests.filter((x) => x !== i) : [...form.interests, i]);
  };
  return (
    <div>
      <p className="text-sm text-muted mb-1">Selected: <span className="text-body font-medium">{form.interests.length}</span></p>
      <div className="flex flex-wrap gap-2 mt-3">
        {INTERESTS.map((i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm capitalize transition-colors',
              form.interests.includes(i) ? 'border-cyan/50 bg-cyan/10 text-body' : 'border-white/[0.08] bg-white/[0.03] text-muted hover:text-body',
            )}
          >
            {form.interests.includes(i) && <Check size={13} className="inline mr-1 text-cyan" />}
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}

function OptionCard({ icon: Icon, title, description, badge, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative rounded-xl border p-4 text-left transition-all',
        active ? 'border-brand-500/60 bg-brand-500/[0.08] shadow-glow' : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20',
      )}
    >
      {active && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
          <Check size={12} className="text-white" />
        </span>
      )}
      <span className={cn('w-10 h-10 rounded-xl flex items-center justify-center', active ? 'bg-brand-500/20' : 'bg-white/[0.06]')}>
        <Icon size={19} className={active ? 'text-brand-400' : 'text-muted'} />
      </span>
      <p className="font-medium text-body mt-3 flex items-center gap-2">{title} {badge && <span className="text-xs text-muted">{badge}</span>}</p>
      <p className="text-xs text-muted mt-1">{description}</p>
    </button>
  );
}

function SummaryCard({ form, duration }) {
  return (
    <Card className="p-5 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-body">Trip summary</h3>
        <Badge tone="ai" label="Live" />
      </div>
      <div className="space-y-3">
        <SummaryRow icon={MapPin} label="Route" value={`${form.origin} → ${form.destination}`} />
        <SummaryRow icon={CalendarDays} label="Duration" value={duration ? `${duration.days} Days / ${duration.nights} Nights` : 'Select dates'} />
        <SummaryRow icon={Users} label="Travelers" value={`${form.travelers.adults + form.travelers.children}`} />
        <SummaryRow icon={Wallet} label="Budget" value={`${formatINR(form.budget)} · ${budgetLevel(form.budget)}`} />
        <SummaryRow icon={Train} label="Transport" value={TRANSPORT_OPTIONS.find((t) => t.value === form.transportPreference)?.label || 'Any'} />
        <SummaryRow icon={Sparkles} label="Interests" value={form.interests.join(', ') || '—'} />
      </div>
    </Card>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
        <Icon size={14} className="text-cyan" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted">{label}</p>
        <p className="text-sm text-body font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
