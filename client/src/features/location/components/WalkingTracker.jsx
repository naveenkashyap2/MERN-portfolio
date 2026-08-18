import Button from '../../../components/ui/Button.jsx';
import DistanceProgress from './DistanceProgress.jsx';
import { formatMins } from '../../../utils/formatters.js';

export default function WalkingTracker({ travelled, remaining, eta, onPause, onStop }) {
  const total = (travelled || 0) + (remaining || 0);
  return (
    <div className="card p-5">
      <p className="text-xs text-accent-cyan">WALKING MODE</p>
      <p className="mt-2 text-2xl font-semibold">{total.toFixed(1)} km</p>
      <p className="text-sm text-ink-mute">{formatMins(eta)}</p>
      <div className="mx-auto my-6 grid h-36 w-36 place-items-center rounded-full border-8 border-accent/30">
        <span className="text-xl font-semibold">{Math.round(((travelled || 0) / Math.max(total, 0.01)) * 100)}%</span>
      </div>
      <DistanceProgress travelled={travelled} remaining={remaining} />
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" onClick={onPause}>
          Pause
        </Button>
        <Button variant="danger" onClick={onStop}>
          Stop
        </Button>
      </div>
    </div>
  );
}
