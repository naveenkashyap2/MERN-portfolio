import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import { inr } from '../../../utils/currency.js';

export default function HotelCard({ hotel, onSave }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{hotel.name}</h3>
          <p className="text-sm text-ink-mute">
            {hotel.city} · {hotel.area} · {hotel.category}
          </p>
        </div>
        <Badge trust={hotel.trust} />
      </div>
      <p className="mt-3 text-lg font-semibold">{hotel.estimatedPrice ? inr(hotel.estimatedPrice) : '—'}</p>
      <p className="text-xs text-ink-mute">{hotel.availabilityMessage}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-mute">
        {(hotel.amenities || []).map((a) => (
          <span key={a} className="rounded-full bg-white/5 px-2 py-1">
            {a}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" onClick={() => onSave?.(hotel)}>
          Save
        </Button>
      </div>
    </article>
  );
}
