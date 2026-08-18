import { inr } from '../../../utils/currency.js';

export default function TripStats({ trip, summary }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="card p-4">
        <p className="text-xs text-ink-mute">Budget</p>
        <p className="mt-1 text-lg font-semibold">{inr(trip?.budget)}</p>
      </div>
      <div className="card p-4">
        <p className="text-xs text-ink-mute">Spent</p>
        <p className="mt-1 text-lg font-semibold">{inr(summary?.spent || 0)}</p>
      </div>
      <div className="card p-4">
        <p className="text-xs text-ink-mute">Remaining</p>
        <p className="mt-1 text-lg font-semibold">{inr(summary?.remaining ?? trip?.budget)}</p>
      </div>
    </div>
  );
}
