import { Link } from 'react-router-dom';

export default function Logo({ compact }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="YatraGenie AI home">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-accent to-accent-cyan text-sm font-bold text-white">
        YG
      </span>
      {!compact && (
        <span className="text-base font-semibold tracking-tight">
          YatraGenie <span className="text-accent-cyan">AI</span>
        </span>
      )}
    </Link>
  );
}
