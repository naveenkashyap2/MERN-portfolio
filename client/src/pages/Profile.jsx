import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, MapPin, Heart, Wallet, Pencil, Check } from 'lucide-react';
import { userApi, tripsApi, favoritesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { INTERESTS, TRAVEL_STYLES, TRANSPORT_OPTIONS, STAY_OPTIONS } from '../constants/trip';
import { cn } from '../utils/cn';

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [prefs, setPrefs] = useState(user?.preferences || {});

  const { data: tripsData } = useQuery({ queryKey: ['trips'], queryFn: () => tripsApi.list() });
  const { data: favsData } = useQuery({ queryKey: ['favorites'], queryFn: () => favoritesApi.list() });

  const trips = tripsData?.trips || [];
  const favs = favsData?.favorites || [];

  const updateName = useMutation({
    mutationFn: () => userApi.updateMe({ name }),
    onSuccess: (res) => {
      setUser(res.user);
      toast.success('Profile updated.');
      setEditingName(false);
    },
  });

  const savePrefs = useMutation({
    mutationFn: () => userApi.updatePreferences(prefs),
    onSuccess: (res) => {
      setUser({ ...user, preferences: res.preferences });
      toast.success('Preferences saved.');
    },
  });

  const stats = [
    { icon: MapPin, label: 'Trips', value: trips.length },
    { icon: Heart, label: 'Saved places', value: favs.filter((f) => f.type === 'place').length },
    { icon: Wallet, label: 'Money saved', value: '₹' + Math.round(trips.reduce((a, t) => a + (t.budget || 0) * 0.12, 0)).toLocaleString('en-IN') },
    { icon: MapPin, label: 'Cities', value: new Set(trips.map((t) => t.destination)).size },
  ];

  const toggleInterest = (i) => {
    const current = prefs.interests || [];
    setPrefs({ ...prefs, interests: current.includes(i) ? current.filter((x) => x !== i) : [...current, i] });
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>

      {/* Header */}
      <Card className="p-6 mt-6 flex items-center gap-5">
        <Avatar name={user?.name} src={user?.avatar} size={72} />
        <div className="flex-1 min-w-0">
          {editingName ? (
            <div className="flex items-center gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-xs" />
              <Button size="sm" icon={Check} loading={updateName.isPending} onClick={() => updateName.mutate()}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <button onClick={() => setEditingName(true)} className="p-1.5 text-muted hover:text-body" aria-label="Edit name"><Pencil size={14} /></button>
            </div>
          )}
          <p className="text-sm text-muted flex items-center gap-1.5 mt-1"><Mail size={13} /> {user?.email}</p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <s.icon size={18} className="text-brand-400" />
            <p className="text-2xl font-bold text-body mt-3">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Preferences */}
      <Card className="p-6 mt-6">
        <h3 className="font-semibold text-body mb-5">Travel preferences</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-sm text-muted mb-2">Travel style</p>
            <Select value={prefs.travelStyle || 'comfort'} onChange={(e) => setPrefs({ ...prefs, travelStyle: e.target.value })}>
              {TRAVEL_STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </div>
          <div>
            <p className="text-sm text-muted mb-2">Preferred transport</p>
            <Select value={prefs.transport || 'any'} onChange={(e) => setPrefs({ ...prefs, transport: e.target.value })}>
              {TRANSPORT_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </div>
          <div>
            <p className="text-sm text-muted mb-2">Budget style</p>
            <Select value={prefs.stay || 'medium'} onChange={(e) => setPrefs({ ...prefs, stay: e.target.value })}>
              {STAY_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button key={i} onClick={() => toggleInterest(i)} className={cn('rounded-full border px-3.5 py-1.5 text-sm capitalize', (prefs.interests || []).includes(i) ? 'border-cyan/50 bg-cyan/10 text-body' : 'border-white/[0.08] bg-white/[0.03] text-muted')}>
                {i}
              </button>
            ))}
          </div>
        </div>

        <Button className="mt-6" loading={savePrefs.isPending} onClick={() => savePrefs.mutate()}>Save preferences</Button>
      </Card>
    </div>
  );
}
