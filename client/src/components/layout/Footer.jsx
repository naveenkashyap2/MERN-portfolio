import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-ink-mute">
            India's AI travel operating system. Plan smarter. Travel better. Live availability is only shown when a provider verifies it.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Product</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-mute">
            <Link to="/plan">Plan Trip</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/assistant">AI Assistant</Link>
            <Link to="/features">Features</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Account</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-mute">
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
            <Link to="/settings">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-ink-mute">
        © {new Date().getFullYear()} YatraGenie AI. Built for India travel.
      </div>
    </footer>
  );
}
