import { cn } from '../../utils/cn';

const tones = {
  live: 'bg-success/15 text-success border-success/30',
  ai: 'bg-cyan/10 text-cyan border-cyan/30',
  estimate: 'bg-warning/15 text-warning border-warning/30',
  cached: 'bg-muted/15 text-muted border-muted/20',
  neutral: 'bg-white/[0.06] text-muted border-white/10',
  brand: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
  danger: 'bg-danger/15 text-danger border-danger/30',
};

export default function Badge({ tone = 'neutral', icon: Icon, children, className, label }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {Icon && <Icon size={12} />}
      {label || children}
    </span>
  );
}
