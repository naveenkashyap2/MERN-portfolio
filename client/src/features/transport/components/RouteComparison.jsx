import { formatMins } from '../../../utils/formatters.js';
import Badge from '../../../components/ui/Badge.jsx';

export default function RouteComparison({ data }) {
  if (!data?.options?.length && !data?.transportEstimates?.options) return null;
  const options = data.transportEstimates?.options || data.options;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {options.map((o) => (
        <div key={o.mode} className="card p-4">
          <p className="text-xs uppercase text-ink-mute">{o.mode}</p>
          <p className="mt-2 text-xl font-semibold">{formatMins(o.durationMinutes)}</p>
          <p className="text-sm text-ink-mute">{o.label || o.notes}</p>
          <div className="mt-2">
            <Badge trust={o.trust} />
          </div>
        </div>
      ))}
    </div>
  );
}
