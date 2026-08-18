import Badge from '../../../components/ui/Badge.jsx';

export default function TransportCard({ title, subtitle, duration, fare, trust, message }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-ink-mute">{subtitle}</p>
        </div>
        <Badge trust={trust} />
      </div>
      <div className="mt-3 flex gap-6 text-sm">
        <span>{duration || '—'}</span>
        <span>{fare || 'Fare unverified'}</span>
      </div>
      {message && <p className="mt-2 text-xs text-ink-mute">{message}</p>}
    </article>
  );
}
