import { useQuery } from '@tanstack/react-query';
import { Star, Clock, IndianRupee, MapPin, Navigation, Sparkles } from 'lucide-react';
import { placesApi } from '../../services/api';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import { imageFor } from '../../constants/images';
import { CATEGORY_LABELS } from '../../constants/places';

export default function PlaceDetailsModal({ placeId, onClose, onNavigate }) {
  const { data, isLoading } = useQuery({
    queryKey: ['place', placeId],
    queryFn: () => placesApi.get(placeId),
    enabled: Boolean(placeId),
  });

  const place = data?.place;

  return (
    <Modal open={Boolean(placeId)} onClose={onClose} size="lg" title={place?.name || 'Place'} subtitle={place ? `${CATEGORY_LABELS[place.category] || place.category} · ${place.city}, ${place.state}` : undefined}>
      {isLoading || !place ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : (
        <div>
          <img src={imageFor(place.imageSlug, 'hero')} alt={place.name} className="w-full h-56 object-cover rounded-xl" />
          <div className="flex items-center gap-2 mt-4">
            <Badge tone={place.dataTrust === 'verified' ? 'live' : 'estimate'} label={place.dataTrust === 'verified' ? 'Verified' : 'Estimate'} />
            {place.popular && <Badge tone="brand" label="Popular" />}
            <Badge tone="ai" icon={Sparkles} label="AI Pick" />
          </div>
          <p className="text-sm text-muted leading-relaxed mt-4">{place.description}</p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <InfoTile icon={Star} label="Rating" value={`${place.rating} (${place.ratingCount?.toLocaleString('en-IN')})`} />
            <InfoTile icon={Clock} label="Best time" value={place.bestTime || '—'} />
            <InfoTile icon={IndianRupee} label="Entry fee" value={place.entryFee ? `₹${place.entryFee}` : 'Free'} />
            <InfoTile icon={MapPin} label="Visit duration" value={`~${Math.round((place.visitDurationMin || 60) / 60)}h`} />
          </div>

          {place.openTime && (
            <p className="text-xs text-muted mt-4">
              Hours: {place.openTime} – {place.closeTime}
              {place.dataTrust !== 'verified' && ' (estimate)'}
            </p>
          )}

          {data?.nearby?.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium text-body mb-2.5">Nearby places</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {data.nearby.map((n) => (
                  <div key={n.id} className="shrink-0 w-32">
                    <img src={imageFor(n.imageSlug, 'hero')} alt={n.name} className="w-32 h-20 object-cover rounded-lg" />
                    <p className="text-xs text-body mt-1.5 truncate">{n.name}</p>
                    <p className="text-[11px] text-muted">{n.distanceMeters ? `${(n.distanceMeters / 1000).toFixed(1)} km` : n.city}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {onNavigate && (
            <button onClick={onNavigate} className="mt-6 w-full h-11 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-medium flex items-center justify-center gap-2">
              <Navigation size={16} /> Navigate
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3">
      <p className="text-[11px] text-muted flex items-center gap-1.5"><Icon size={12} className="text-cyan" /> {label}</p>
      <p className="text-sm font-medium text-body mt-1">{value}</p>
    </div>
  );
}
