import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';

export default function PlaceCard({ place, onFav }) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-bg-card">
      <div className="relative h-36 bg-gradient-to-br from-accent/30 to-bg-elevated">
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full bg-black/40 p-2"
          aria-label="Favorite"
          onClick={() => onFav?.(place)}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium">{place.name}</h3>
            <p className="text-xs capitalize text-ink-mute">
              {place.category} · {place.city}
            </p>
          </div>
          <Badge trust={place.trust} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-ink-mute">{place.description}</p>
        <div className="mt-3 flex gap-3 text-sm">
          <Link to={`/places?id=${place.id}`} className="text-accent-cyan">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
