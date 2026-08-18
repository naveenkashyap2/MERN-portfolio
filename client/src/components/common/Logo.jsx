import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Logo({ className, to = '/', compact = false }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2.5 shrink-0', className)} aria-label="YatraGenie AI home">
      <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-cyan flex items-center justify-center shadow-glow">
        <Compass size={20} className="text-white" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan animate-pulse-soft" />
      </span>
      {!compact && (
        <span className="font-display font-semibold text-lg text-body leading-none">
          YatraGenie <span className="text-gradient">AI</span>
        </span>
      )}
    </Link>
  );
}
