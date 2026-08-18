function Counter({ label, value, min, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-bg-card px-4 py-3">
      <span>{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" className="h-8 w-8 rounded-md bg-white/5" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`Decrease ${label}`}>
          -
        </button>
        <span className="w-6 text-center">{value}</span>
        <button type="button" className="h-8 w-8 rounded-md bg-white/5" onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}

export default function TravelerSelector({ value, onChange }) {
  const total = (value.adults || 0) + (value.children || 0);
  return (
    <div className="space-y-3">
      <Counter label="Adults" value={value.adults} min={1} onChange={(adults) => onChange({ ...value, adults })} />
      <Counter label="Children" value={value.children} min={0} onChange={(children) => onChange({ ...value, children })} />
      <p className="text-sm text-ink-mute">{total} Travelers</p>
    </div>
  );
}
