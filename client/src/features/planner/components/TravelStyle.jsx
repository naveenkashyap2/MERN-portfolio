import { TRANSPORT_OPTIONS } from '../../../constants/app.js';

export default function TravelStyle({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {TRANSPORT_OPTIONS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`rounded-xl border p-4 text-left ${
            value === t.id ? 'border-accent shadow-glow' : 'border-white/10 bg-bg-card'
          }`}
        >
          <p className="font-medium">{t.label}</p>
          <p className="text-sm text-ink-mute">{t.description}</p>
        </button>
      ))}
    </div>
  );
}
