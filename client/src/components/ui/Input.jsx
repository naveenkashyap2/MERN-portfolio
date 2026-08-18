import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-body mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 rounded-[12px] bg-ink-800/70 border border-white/10 text-body text-sm px-3.5',
            'placeholder:text-muted/60 transition-colors focus:border-brand-400/70 focus:bg-ink-800',
            Icon && 'pl-10',
            error && 'border-danger/60 focus:border-danger',
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
