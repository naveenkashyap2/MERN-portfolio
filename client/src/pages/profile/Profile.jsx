import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import ProfileForm from '../../features/profile/components/ProfileForm.jsx';
import TravelPreferences from '../../features/profile/components/TravelPreferences.jsx';
import { profileApi } from '../../features/profile/profile.api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from '../../store/ui.store.js';
import { useTrips } from '../../features/trips/hooks/useTrips.js';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { data: me } = useQuery({ queryKey: ['users-me'], queryFn: profileApi.me });
  const { data: trips } = useTrips({ limit: 1 });
  const [prefs, setPrefs] = useState(null);
  const current = prefs || me?.user?.preferences || user?.preferences || {};

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-accent/30 text-xl font-semibold">
          {user?.name?.[0] || 'Y'}
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{user?.name}</h1>
          <p className="text-sm text-ink-mute">{user?.email}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ['Trips', trips?.total || 0],
          ['Places', '—'],
          ['Cities', '—'],
          ['Saved', '—'],
        ].map(([k, v]) => (
          <div key={k} className="card p-4">
            <p className="text-xs text-ink-mute">{k}</p>
            <p className="text-lg font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Account</h2>
          <ProfileForm
            user={user}
            onSave={async (body) => {
              const res = await profileApi.update(body);
              setUser(res.user);
              toast('Profile updated.', 'success');
            }}
          />
        </div>
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Travel preferences</h2>
          <TravelPreferences
            value={current}
            onChange={setPrefs}
            onSave={async () => {
              await profileApi.updatePrefs(current);
              toast('Preferences saved.', 'success');
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
