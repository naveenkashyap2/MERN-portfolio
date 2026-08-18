export default function LiveLocation({ here, next, distance, eta, progress }) {
  return (
    <div className="card p-5">
      <p className="text-xs text-accent-cyan">📍 You are here</p>
      <p className="mt-1 text-lg font-semibold">{here || 'Locating...'}</p>
      <p className="mt-3 text-sm text-ink-mute">Next: {next || '—'}</p>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-ink-mute">Distance</p>
          <p>{distance ?? '—'}</p>
        </div>
        <div>
          <p className="text-ink-mute">ETA</p>
          <p>{eta ?? '—'}</p>
        </div>
        <div>
          <p className="text-ink-mute">Progress</p>
          <p>{progress ?? 0}%</p>
        </div>
      </div>
    </div>
  );
}
