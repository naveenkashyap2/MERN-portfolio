import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-[0_8px_24px_-8px_rgba(59,130,246,0.7)] hover:from-brand-500 hover:to-brand-400',
  secondary: 'bg-white/[0.06] text-body border border-white/10 hover:bg-white/[0.1]',
  ghost: 'text-muted hover:text-body hover:bg-white/[0.06]',
  outline: 'border border-white/15 text-body hover:border-brand-400/60 hover:text-brand-400',
  danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
  glass: 'glass text-body hover:bg-white/[0.09]',
  cyan: 'bg-gradient-to-r from-cyan to-brand-500 text-white shadow-[0_8px_24px_-8px_rgba(6,182,212,0.6)]',
};

const sizes = {
  xs: 'h-8 px-3 text-xs',
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, icon: Icon, iconRight: IconRight, className, children, disabled, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[12px] font-medium transition-colors select-none',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
      {!loading && IconRight ? <IconRight size={16} /> : null}
    </motion.button>
  );
});

export default Button;
