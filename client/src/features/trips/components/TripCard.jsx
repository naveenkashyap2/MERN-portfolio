import { Link } from 'react-router-dom';
import { inr } from '../../../utils/currency.js';
import { formatDate } from '../../../utils/date.js';
import { travelerLabel } from '../../../utils/formatters.js';

export default function TripCard({ trip, onDelete, onDuplicate, onShare }) {
  return (
    <article className="card p-5 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            {trip.origin?.name} → {trip.destination?.name}
          </h3>
          <p className="mt-1 text-sm text-ink-mute">
            {formatDate(trip.startDate)} – {formatDate(trip.endDate)} · {inr(trip.budget)} · {travelerLabel(trip.travelers)}
          </p>
        </div>
        <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] capitalize text-ink-mute">{trip.status}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link to={`/trips/${trip._id}`} className="text-accent-cyan">
          View
        </Link>
        <Link to={`/trips/${trip._id}/edit`} className="text-ink-mute hover:text-ink">
          Edit
        </Link>
        <button type="button" className="text-ink-mute hover:text-ink" onClick={() => onShare?.(trip)}>
          Share
        </button>
        <button type="button" className="text-ink-mute hover:text-ink" onClick={() => onDuplicate?.(trip)}>
          Duplicate
        </button>
        <button type="button" className="text-red-300" onClick={() => onDelete?.(trip)}>
          Delete
        </button>
      </div>
    </article>
  );
}
