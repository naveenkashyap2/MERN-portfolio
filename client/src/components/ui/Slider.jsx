import { cn } from '../../utils/cn';

export default function Slider({ value, onChange, min = 0, max = 100, step = 1, className, marks }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn('w-full', className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-white/[0.08] cursor-pointer range-brand"
        style={{
          background: `linear-gradient(to right, #3B82F6 ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
        }}
      />
      {marks && (
        <div className="flex justify-between mt-2 text-xs text-muted">
          {marks.map((m) => (
            <span key={m} className={Number(m.replace(/\D/g, '')) <= value ? 'text-brand-400' : ''}>
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
