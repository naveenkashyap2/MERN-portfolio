import { STAY_OPTIONS } from '../../../constants/app.js';

export default function StaySelector({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {STAY_OPTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          className={`rounded-xl border p-4 text-left ${
            value === s.id ? 'border-accent shadow-glow' : 'border-white/10 bg-bg-card'
          }`}
        >
          <p className="text-xs text-ink-mute">{s.rupees}</p>
          <p className="font-medium">{s.label}</p>
          <p className="text-sm text-ink-mute">{s.description}</p>
        </button>
      ))}
    </div>
  );
}
