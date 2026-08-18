import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Tabs from '../../components/ui/Tabs.jsx';
import SecuritySettings from '../../features/profile/components/SecuritySettings.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Button from '../../components/ui/Button.jsx';
import { profileApi } from '../../features/profile/profile.api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from '../../store/ui.store.js';

export default function Settings() {
  const [tab, setTab] = useState('account');
  const [bye, setBye] = useState(false);
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const { data: me } = useQuery({ queryKey: ['users-me'], queryFn: profileApi.me });
  const { data: notes } = useQuery({ queryKey: ['notifications'], queryFn: profileApi.notifications });

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="mt-6">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={['account', 'security', 'privacy', 'location', 'notifications', 'ai'].map((id) => ({ id, label: id }))}
        />
      </div>
      <div className="mt-6 max-w-2xl">
        {tab === 'account' && (
          <div className="card space-y-4 p-5">
            <p className="text-sm text-ink-mute">{user?.email}</p>
            <Button variant="danger" onClick={() => setBye(true)}>
              Delete account
            </Button>
          </div>
        )}
        {tab === 'security' && (
          <SecuritySettings
            sessions={me?.sessions || []}
            hasGoogle={user?.hasGoogle}
            hasPassword={user?.hasPassword}
            onLogoutAll={async () => {
              await logout(true);
              toast('Signed out everywhere.', 'success');
              navigate('/login');
            }}
          />
        )}
        {tab === 'privacy' && (
          <div className="card space-y-3 p-5 text-sm text-ink-mute">
            <p>Trips are private by default. Share links use random tokens.</p>
            <p>AI conversations stay user-scoped.</p>
          </div>
        )}
        {tab === 'location' && (
          <div className="card space-y-3 p-5">
            <p className="text-sm">Tracking default is OFF. We never start GPS silently.</p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(user?.preferences?.location?.historyEnabled)}
                onChange={async (e) => {
                  const preferences = {
                    ...user.preferences,
                    location: { ...user.preferences?.location, historyEnabled: e.target.checked },
                  };
                  const next = await profileApi.updatePrefs(preferences);
                  setUser({ ...user, preferences: next });
                }}
              />
              Keep location history (limited retention)
            </label>
          </div>
        )}
        {tab === 'notifications' && (
          <div className="card p-5">
            <div className="mb-3 flex justify-between">
              <p className="text-sm">{notes?.unread || 0} unread</p>
              <button type="button" className="text-xs text-accent-cyan" onClick={() => profileApi.readAll()}>
                Mark all as read
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {(notes?.items || []).map((n) => (
                <li key={n._id} className="rounded-md bg-white/5 p-3">
                  <p>{n.title}</p>
                  <p className="text-xs text-ink-mute">{n.body}</p>
                </li>
              ))}
              {!notes?.items?.length && <li className="text-ink-mute">Nothing here yet.</li>}
            </ul>
          </div>
        )}
        {tab === 'ai' && (
          <div className="card p-5 text-sm text-ink-mute">
            Gemini runs only on the server. The assistant may use your current trip context if you allow it.
          </div>
        )}
      </div>
      <ConfirmDialog
        open={bye}
        title="Delete your account?"
        body="This permanently removes trips, expenses, conversations, and location history."
        confirm="Delete account"
        danger
        onClose={() => setBye(false)}
        onConfirm={async () => {
          await profileApi.remove();
          setUser(null);
          navigate('/');
        }}
      />
    </DashboardLayout>
  );
}
