import { inr } from '../../../utils/currency.js';

const STOPS = [1000, 5000, 10000, 25000, 50000];

export default function BudgetSelector({ value, onChange }) {
  const level = value < 4000 ? 'Budget' : value < 15000 ? 'Comfort' : 'Premium';
  return (
    <div>
      <div className="flex items-end justify-between">
        <p className="label">Budget</p>
        <p className="text-lg font-semibold">{inr(value)}</p>
      </div>
      <input
        type="range"
        min={1000}
        max={50000}
        step={500}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-accent"
      />
      <div className="mt-2 flex justify-between text-[11px] text-ink-mute">
        {STOPS.map((s) => (
          <button key={s} type="button" onClick={() => onChange(s)}>
            {s >= 50000 ? '₹50k+' : `₹${s / 1000}k`}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-accent-cyan">{level}</p>
      <input className="input mt-3" type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
