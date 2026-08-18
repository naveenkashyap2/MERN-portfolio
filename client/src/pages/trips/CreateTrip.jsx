import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import TripPlannerForm from '../../features/planner/components/TripPlannerForm.jsx';
import { validatePlanner } from '../../features/planner/planner.validation.js';
import { aiApi } from '../../features/ai/ai.api.js';
import { toast } from '../../store/ui.store.js';
import { errorMessage } from '../../utils/errorHandler.js';
import { inr } from '../../utils/currency.js';
import { daysBetween } from '../../utils/date.js';

const STEPS = ['Destination', 'Dates', 'Travelers', 'Budget', 'Transport', 'Stay', 'Generate'];
const GEN = [
  'Understanding your preferences',
  'Optimizing your route',
  'Finding places',
  'Planning your itinerary',
  'Calculating your budget',
  'Preparing your trip',
];

export default function CreateTrip() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState([]);
  const [draft, setDraft] = useState({
    origin: params.get('from') || 'Delhi',
    destination: params.get('to') || 'Agra',
    startDate: today,
    endDate: tomorrow,
    travelers: { adults: 2, children: 0 },
    budget: Number(params.get('budget') || 5000),
    transportPreference: 'train',
    stayPreference: 'medium',
    interests: ['historical', 'temple', 'food'],
    naturalLanguage: params.get('nl') || '',
  });

  const summary = useMemo(
    () => ({
      title: `${draft.origin} → ${draft.destination}`,
      days: draft.startDate && draft.endDate ? daysBetween(draft.startDate, draft.endDate) : 0,
      budget: inr(draft.budget),
      people: (draft.travelers.adults || 0) + (draft.travelers.children || 0),
    }),
    [draft]
  );

  useEffect(() => {
    if (!generating) return undefined;
    setDone([]);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setDone(GEN.slice(0, i));
      if (i >= GEN.length) clearInterval(t);
    }, 450);
    return () => clearInterval(t);
  }, [generating]);

  const next = () => {
    if (step === 0 && (!draft.origin || !draft.destination)) {
      toast('Add origin and destination.', 'warning');
      return;
    }
    setStep((s) => Math.min(6, s + 1));
  };

  const generate = async () => {
    const errors = validatePlanner(draft);
    if (Object.keys(errors).length) {
      toast(Object.values(errors)[0], 'warning');
      return;
    }
    setGenerating(true);
    try {
      const res = await aiApi.generate(draft);
      toast('Your journey is ready.', 'success');
      navigate(`/trips/${res.trip._id}`);
    } catch (err) {
      toast(errorMessage(err), 'error');
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-xl py-16 text-center">
          <p className="text-xs text-accent-cyan">✨ YatraGenie</p>
          <h1 className="mt-3 text-3xl font-semibold">YatraGenie is building your journey...</h1>
          <ul className="mx-auto mt-10 max-w-sm space-y-3 text-left text-sm">
            {GEN.map((g) => (
              <li key={g} className={done.includes(g) ? 'text-ink' : 'text-ink-mute'}>
                {done.includes(g) ? '✓' : '•'} {g}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-ink-mute">AI-generated plans are labeled. We do not fake live provider checks.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <span key={s} className={`rounded-full px-3 py-1 text-xs ${i === step ? 'bg-accent text-white' : 'bg-white/5 text-ink-mute'}`}>
            {String(i + 1).padStart(2, '0')} {s}
          </span>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="card p-6">
          <TripPlannerForm step={step} draft={draft} setDraft={setDraft} />
          {step === 6 && (
            <label className="mt-6 block">
              <span className="label">Or tell YatraGenie in your words</span>
              <textarea
                className="input min-h-24"
                value={draft.naturalLanguage}
                onChange={(e) => setDraft({ ...draft, naturalLanguage: e.target.value })}
                placeholder="Delhi se Agra 2 din ke liye..."
              />
            </label>
          )}
          <div className="mt-8 flex justify-between">
            <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            {step < 6 ? (
              <Button onClick={next}>Continue</Button>
            ) : (
              <Button onClick={generate}>Generate My Trip ✨</Button>
            )}
          </div>
        </div>
        <aside className="card h-fit p-6">
          <p className="text-xs text-ink-mute">Live trip summary</p>
          <h2 className="mt-2 text-xl font-semibold">{summary.title}</h2>
          <dl className="mt-4 space-y-2 text-sm text-ink-mute">
            <div className="flex justify-between"><dt>Duration</dt><dd className="text-ink">{summary.days || '—'} days</dd></div>
            <div className="flex justify-between"><dt>Budget</dt><dd className="text-ink">{summary.budget}</dd></div>
            <div className="flex justify-between"><dt>Travelers</dt><dd className="text-ink">{summary.people}</dd></div>
            <div className="flex justify-between"><dt>Transport</dt><dd className="text-ink capitalize">{draft.transportPreference}</dd></div>
            <div className="flex justify-between"><dt>Stay</dt><dd className="text-ink capitalize">{draft.stayPreference}</dd></div>
          </dl>
        </aside>
      </div>
    </DashboardLayout>
  );
}
