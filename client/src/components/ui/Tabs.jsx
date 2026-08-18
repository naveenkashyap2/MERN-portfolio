import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn('flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] w-fit overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
              active ? 'text-body' : 'text-muted hover:text-body',
            )}
            role="tab"
            aria-selected={active}
          >
            {active && (
              <motion.span
                layoutId={`tab-${tabs.map((t) => t.value).join('-')}`}
                className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/10"
                transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <tab.icon size={15} />}
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[10px] text-muted bg-white/[0.07] rounded-full px-1.5 py-0.5">{tab.count}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
