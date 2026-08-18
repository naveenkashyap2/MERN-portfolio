import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Logo from '../common/Logo';

const COLUMNS = [
  { title: 'Product', links: [['Plan Trip', '/plan'], ['My Trips', '/trips'], ['Explore', '/explore'], ['AI Assistant', '/assistant']] },
  { title: 'Discover', links: [['Transport', '/transport'], ['Hotels', '/hotels'], ['Nearby', '/nearby'], ['Favorites', '/favorites']] },
  { title: 'Account', links: [['Profile', '/profile'], ['Settings', '/settings'], ['Sign in', '/login'], ['Register', '/register']] },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <Logo />
          <p className="text-sm text-muted mt-4 max-w-xs">
            India's AI travel &amp; trip planning assistant. Plan smarter, travel better.
          </p>
          <div className="flex items-center gap-2 mt-5 text-xs text-muted">
            <Compass size={14} className="text-brand-400" />
            Made for India 🇮🇳
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-body mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-muted hover:text-body transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.06] py-6">
        <p className="text-xs text-muted text-center px-4">
          © {new Date().getFullYear()} YatraGenie AI. AI itineraries are estimates — always verify live transport &amp; hotel availability with providers.
        </p>
      </div>
    </footer>
  );
}
