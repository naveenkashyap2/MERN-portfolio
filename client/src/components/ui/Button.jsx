import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-gradient-to-r from-accent to-accent-cyan text-white shadow-glow hover:-translate-y-0.5',
  secondary: 'bg-white/5 text-ink border border-white/10 hover:bg-white/10',
  ghost: 'bg-transparent text-ink-mute hover:text-ink hover:bg-white/5',
  danger: 'bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25',
};

export default function Button({
  children,
  variant = 'primary',
  loading,
  disabled,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition duration-200 disabled:opacity-50 disabled:translate-y-0 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
