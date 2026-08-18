import Progress from '../../../components/ui/Progress.jsx';

export default function DistanceProgress({ travelled, remaining }) {
  const total = (travelled || 0) + (remaining || 0);
  const pct = total ? Math.round((travelled / total) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm text-ink-mute">
        <span>{travelled?.toFixed?.(1) || 0} km</span>
        <span>{remaining?.toFixed?.(1) || 0} km left</span>
      </div>
      <Progress value={pct} />
    </div>
  );
}
