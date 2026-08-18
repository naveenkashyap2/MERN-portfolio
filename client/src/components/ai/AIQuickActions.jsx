import { Sparkles } from 'lucide-react';
import { AI_QUICK_ACTIONS } from '../../constants/trip';

export default function AIQuickActions({ onAction, compact = false }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {AI_QUICK_ACTIONS.slice(0, compact ? 4 : undefined).map((a) => (
        <button
          key={a.id}
          onClick={() => onAction(a)}
          className="shrink-0 flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted hover:text-body hover:border-brand-500/40 hover:bg-brand-500/10 transition-colors"
        >
          <Sparkles size={12} className="text-cyan" />
          {a.label}
        </button>
      ))}
    </div>
  );
}
