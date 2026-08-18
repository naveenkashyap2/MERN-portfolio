import { NavLink } from 'react-router-dom';
import {
  Home,
  Map,
  Compass,
  Train,
  Hotel,
  Navigation,
  Sparkles,
  Heart,
  Bell,
  Settings,
  User,
} from 'lucide-react';
import Logo from '../common/Logo.jsx';

const items = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/plan', label: 'Plan Trip', icon: Map },
  { to: '/trips', label: 'My Trips', icon: Compass },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/transport', label: 'Transport', icon: Train },
  { to: '/hotels', label: 'Hotels', icon: Hotel },
  { to: '/nearby', label: 'Nearby', icon: Navigation },
  { to: '/assistant', label: 'AI Assistant', icon: Sparkles },
  { to: '/favorites', label: 'Favorites', icon: Heart },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-bg-secondary p-4 lg:flex">
      <Logo />
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  isActive ? 'bg-accent/15 text-ink' : 'text-ink-mute hover:bg-white/5 hover:text-ink'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 pt-3">
        <NavLink to="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-mute hover:text-ink">
          <Bell className="h-4 w-4" /> Notifications
        </NavLink>
        <NavLink to="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-mute hover:text-ink">
          <Settings className="h-4 w-4" /> Settings
        </NavLink>
        <NavLink to="/profile" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-mute hover:text-ink">
          <User className="h-4 w-4" /> Profile
        </NavLink>
      </div>
    </aside>
  );
}
