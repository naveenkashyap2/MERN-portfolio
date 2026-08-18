import { cn } from '../../utils/cn';

export function ProgressBar({ value = 0, max = 100, className, tone = 'brand' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const tones = {
    brand: 'from-brand-500 to-cyan',
    success: 'from-success to-emerald-400',
    warning: 'from-warning to-amber-400',
    danger: 'from-danger to-rose-400',
  };
  return (
    <div className={cn('h-2 w-full rounded-full bg-white/[0.08] overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full bg-gradient-to-r transition-[width] duration-500', tones[tone])}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

export function ProgressRing({ value = 0, max = 100, size = 120, stroke = 8, label, className }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          className="transition-[stroke-dashoffset] duration-700"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-body">{Math.round(pct)}%</span>
        {label && <span className="text-[11px] text-muted">{label}</span>}
      </div>
    </div>
  );
}
