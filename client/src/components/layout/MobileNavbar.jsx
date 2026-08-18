import { NavLink } from 'react-router-dom';
import { Home, Compass, Map, Sparkles, User } from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/trips', label: 'Trips', icon: Map },
  { to: '/assistant', label: 'AI', icon: Sparkles },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function MobileNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-bg-secondary/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] ${isActive ? 'text-accent-cyan' : 'text-ink-mute'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5" />
                  {item.label}
                  {isActive && <span className="h-1 w-1 rounded-full bg-accent-cyan" />}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
