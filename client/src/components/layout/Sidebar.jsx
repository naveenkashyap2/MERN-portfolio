import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Route, Map, Compass, TrainFront, Hotel, LocateFixed, Sparkles, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '../common/Logo';
import { cn } from '../../utils/cn';

const MAIN = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/plan', label: 'Plan Trip', icon: Map },
  { to: '/trips', label: 'My Trips', icon: Route },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/transport', label: 'Transport', icon: TrainFront },
  { to: '/hotels', label: 'Hotels', icon: Hotel },
  { to: '/nearby', label: 'Nearby', icon: LocateFixed },
  { to: '/assistant', label: 'AI Assistant', icon: Sparkles },
  { to: '/favorites', label: 'Favorites', icon: Heart },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-ink-900/60 border-r border-white/[0.06] backdrop-blur-xl transition-[width] duration-300',
        collapsed ? 'w-[76px]' : 'w-[256px]',
      )}
    >
      <div className={cn('h-16 flex items-center border-b border-white/[0.06] shrink-0', collapsed ? 'justify-center px-3' : 'px-5')}>
        <Logo compact={collapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {MAIN.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive ? 'text-body' : 'text-muted hover:text-body hover:bg-white/[0.04]',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500/15 to-cyan/10 border border-brand-500/20"
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <item.icon size={19} className={cn('relative z-10 shrink-0', isActive && 'text-brand-400')} />
                {!collapsed && <span className="relative z-10">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs text-muted hover:text-body hover:bg-white/[0.04] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Collapse</>}
        </button>
      </div>
    </aside>
  );
}
