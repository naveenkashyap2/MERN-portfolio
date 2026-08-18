import { INTERESTS } from '../../../constants/app.js';

export default function PlacePreferences({ value = [], onChange }) {
  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => toggle(i.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              value.includes(i.id) ? 'bg-accent text-white' : 'bg-white/5 text-ink-mute'
            }`}
          >
            {i.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-mute">{value.length} selected</p>
    </div>
  );
}
