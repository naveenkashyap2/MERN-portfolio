import Button from '../../../components/ui/Button.jsx';

export default function SecuritySettings({ sessions = [], onLogoutAll, hasGoogle, hasPassword }) {
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <p className="text-sm">Password: {hasPassword ? 'Set' : 'Not set'}</p>
        <p className="text-sm">Google: {hasGoogle ? 'Connected' : 'Not connected'}</p>
        <p className="mt-2 text-xs text-emerald-300">Protected</p>
      </div>
      <div className="card p-4">
        <p className="mb-2 text-sm font-medium">Active sessions</p>
        <ul className="space-y-2 text-xs text-ink-mute">
          {sessions.map((s) => (
            <li key={s.id}>{s.userAgent || 'Device'} · {new Date(s.createdAt).toLocaleString('en-IN')}</li>
          ))}
          {!sessions.length && <li>No other sessions.</li>}
        </ul>
        <Button className="mt-4" variant="danger" onClick={onLogoutAll}>
          Logout all devices
        </Button>
      </div>
    </div>
  );
}
