import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Search, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import NotificationsBell from '../common/NotificationsBell';
import Avatar from '../ui/Avatar';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className={`transition-[padding] duration-300 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[256px]'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-ink-950/70 backdrop-blur-xl border-b border-white/[0.06]">
          <form onSubmit={submitSearch} className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              id="global-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search places, hotels, trips…  ( / )"
              className="w-full h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] pl-9 pr-16 text-sm text-body placeholder:text-muted/60 focus:border-brand-400/60 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted bg-white/[0.06] border border-white/[0.08] rounded px-1.5 py-0.5">
              /
            </span>
          </form>

          <div className="flex items-center gap-1 ml-auto">
            <NotificationsBell />
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.06]" aria-label="Account menu">
                  <Avatar name={user?.name} src={user?.avatar} size={34} />
                  <span className="hidden md:block text-sm font-medium text-body max-w-[120px] truncate">{user?.name}</span>
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
          </div>
        </header>

        <main className="px-4 sm:px-6 py-6 pb-24 lg:pb-10 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
