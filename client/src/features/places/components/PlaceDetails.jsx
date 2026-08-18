import Badge from '../../../components/ui/Badge.jsx';

export default function PlaceDetails({ place }) {
  if (!place) return null;
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">{place.name}</h2>
          <p className="text-sm text-ink-mute">
            {place.city}, {place.state}
          </p>
        </div>
        <Badge trust={place.trust} />
      </div>
      <p className="mt-4 text-sm text-ink-mute">{place.description}</p>
      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex justify-between"><dt className="text-ink-mute">Best time</dt><dd>{place.bestTime || 'Unverified'}</dd></div>
        <div className="flex justify-between"><dt className="text-ink-mute">Entry fee</dt><dd>{place.entryFee != null ? `₹${place.entryFee}` : 'Unverified'}</dd></div>
        <div className="flex justify-between"><dt className="text-ink-mute">Opening hours</dt><dd>Unverified</dd></div>
      </dl>
    </div>
  );
}
