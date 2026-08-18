import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut, User, LayoutDashboard, Settings, MapPin, Sparkles, Trash2 } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import NotificationsBell from '../common/NotificationsBell';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Plan Trip', to: '/plan' },
  { label: 'My Trips', to: '/trips' },
  { label: 'AI Assistant', to: '/assistant' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent border-b border-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />

        <div className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-body bg-white/[0.06]' : 'text-muted hover:text-body',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NotificationsBell />
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 pl-1 pr-1 rounded-xl" aria-label="Account menu">
                    <Avatar name={user?.name} src={user?.avatar} size={34} />
                  </button>
                }
              >
                <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                  <p className="text-sm font-medium text-body truncate">{user?.name}</p>
                  <p className="text-xs text-muted truncate">{user?.email}</p>
                </div>
                <DropdownItem icon={LayoutDashboard} onClick={() => navigate('/dashboard')}>Dashboard</DropdownItem>
                <DropdownItem icon={User} onClick={() => navigate('/profile')}>Profile</DropdownItem>
                <DropdownItem icon={Settings} onClick={() => navigate('/settings')}>Settings</DropdownItem>
                <DropdownItem icon={LogOut} danger onClick={() => { logout(); navigate('/'); }}>Logout</DropdownItem>
              </Dropdown>
              <Button size="sm" icon={Sparkles} className="hidden sm:inline-flex" onClick={() => navigate('/plan')}>
                Plan Trip
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-sm font-medium text-muted hover:text-body px-3 py-2">
                Sign in
              </Link>
              <Button size="sm" icon={Sparkles} className="hidden sm:inline-flex" onClick={() => navigate('/plan')}>
                Plan My Trip
              </Button>
            </>
          )}

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2.5 rounded-xl text-muted hover:text-body hover:bg-white/[0.06]"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-ink-850 border-l border-white/10 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
                <Logo />
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-muted hover:text-body">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium',
                        isActive ? 'text-body bg-white/[0.06]' : 'text-muted hover:text-body',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="border-t border-white/[0.08] my-3" />
                <NavLink to="/favorites" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-muted hover:text-body">
                  Favorites
                </NavLink>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-muted hover:text-body">
                  Profile
                </NavLink>
                <NavLink to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-muted hover:text-body">
                  Settings
                </NavLink>
                {isAuthenticated && (
                  <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-danger hover:bg-danger/10 w-full">
                    <LogOut size={18} /> Logout
                  </button>
                )}
              </div>
              <div className="p-4 border-t border-white/[0.08]">
                <Button className="w-full" icon={MapPin} onClick={() => { setMenuOpen(false); navigate('/plan'); }}>
                  Plan My Trip
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
