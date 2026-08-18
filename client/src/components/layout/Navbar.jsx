import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search } from 'lucide-react';
import Logo from '../common/Logo.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import Drawer from '../ui/Drawer.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/plan', label: 'Plan Trip' },
  { to: '/trips', label: 'My Trips' },
  { to: '/assistant', label: 'AI Assistant' },
];

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 ${scrolled ? 'glass' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm ${isActive ? 'text-ink' : 'text-ink-mute hover:text-ink'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden rounded-md p-2 text-ink-mute hover:text-ink md:inline-flex"
            aria-label="Search"
            onClick={() => navigate('/explore')}
          >
            <Search className="h-5 w-5" />
          </button>
          {user && (
            <Link to="/settings" className="hidden rounded-md p-2 text-ink-mute hover:text-ink md:inline-flex" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Link>
          )}
          {user ? (
            <Link to="/profile" className="hidden text-sm text-ink-mute hover:text-ink md:inline">
              {user.name}
            </Link>
          ) : (
            <Link to="/login" className="hidden text-sm text-ink-mute hover:text-ink md:inline">
              Sign in
            </Link>
          )}
          <Button className="hidden sm:inline-flex" onClick={() => navigate('/plan')}>
            Plan Trip
          </Button>
          <button type="button" className="rounded-md p-2 lg:hidden" aria-label="Open menu" onClick={() => setMenu(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <Drawer open={menu} onClose={() => setMenu(false)} title="Menu" side="right">
        <div className="flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenu(false)} className="text-ink-mute hover:text-ink">
              {l.label}
            </Link>
          ))}
          <Link to="/favorites" onClick={() => setMenu(false)}>
            Favorites
          </Link>
          <Link to="/profile" onClick={() => setMenu(false)}>
            Profile
          </Link>
          <Link to="/settings" onClick={() => setMenu(false)}>
            Settings
          </Link>
        </div>
      </Drawer>
    </header>
  );
}
