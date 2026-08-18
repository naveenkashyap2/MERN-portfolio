import { cn } from '../../utils/cn';

export default function Switch({ checked, onChange, label, description, disabled }) {
  return (
    <label className={cn('flex items-start gap-3', disabled ? 'opacity-60' : 'cursor-pointer')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors shrink-0 mt-0.5',
          checked ? 'bg-brand-500' : 'bg-white/[0.12]',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
      <span>
        <span className="block text-sm font-medium text-body">{label}</span>
        {description && <span className="block text-xs text-muted mt-0.5">{description}</span>}
      </span>
    </label>
  );
}
