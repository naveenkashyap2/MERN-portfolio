export default function Progress({ value = 0 }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-cyan" style={{ width: `${v}%` }} />
    </div>
  );
}
