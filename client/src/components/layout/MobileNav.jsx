import { NavLink } from 'react-router-dom';
import { Home, Compass, Route, Sparkles, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const ITEMS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/trips', label: 'Trips', icon: Route },
  { to: '/assistant', label: 'AI', icon: Sparkles },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink-950/90 backdrop-blur-xl border-t border-white/[0.08] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors', isActive ? 'text-brand-400' : 'text-muted')
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} />
                <span>{item.label}</span>
                <span className={cn('h-1 w-1 rounded-full bg-brand-400 transition-opacity', isActive ? 'opacity-100' : 'opacity-0')} />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
