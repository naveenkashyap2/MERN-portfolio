import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Lock, MapPin, Bell, Sparkles, LogOut, Trash2, Check } from 'lucide-react';
import { userApi, authApi, locationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Switch from '../components/ui/Switch';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { getErrorMessage } from '../lib/axios';
import { cn } from '../utils/cn';

const TABS = [
  { value: 'account', label: 'Account', icon: User },
  { value: 'security', label: 'Security', icon: ShieldCheck },
  { value: 'privacy', label: 'Privacy', icon: Lock },
  { value: 'location', label: 'Location', icon: MapPin },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'ai', label: 'AI Preferences', icon: Sparkles },
];

export default function Settings() {
  const [tab, setTab] = useState('account');
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
      <p className="text-muted mt-1 text-sm">Manage your account, security and privacy.</p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mt-6 py-1">
        {TABS.map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)} className={cn('shrink-0 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium', tab === t.value ? 'border-brand-500/50 bg-brand-500/10 text-body' : 'border-white/[0.08] bg-white/[0.03] text-muted hover:text-body')}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-2xl">
        {tab === 'account' && <AccountTab />}
        {tab === 'security' && <SecurityTab />}
        {tab === 'privacy' && <PrivacyTab />}
        {tab === 'location' && <LocationTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'ai' && <AITab />}
      </div>
    </div>
  );
}

function AccountTab() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const saveName = useMutation({
    mutationFn: () => userApi.updateMe({ name }),
    onSuccess: (res) => { setUser(res.user); toast.success('Name updated.'); },
  });
  const saveAvatar = useMutation({
    mutationFn: () => userApi.updateAvatar(avatar),
    onSuccess: (res) => { setUser(res.user); toast.success('Avatar updated.'); },
  });

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h3 className="font-semibold text-body mb-4">Profile</h3>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" loading={saveName.isPending} onClick={() => saveName.mutate()}>Save name</Button>
          </div>
          <Input label="Avatar URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://…" />
          <Button size="sm" variant="secondary" loading={saveAvatar.isPending} onClick={() => saveAvatar.mutate()}>Update avatar</Button>
          <p className="text-xs text-muted">Signed in as <span className="text-body">{user?.email}</span></p>
        </div>
      </Card>
    </div>
  );
}

function SecurityTab() {
  const toast = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ current: '', next: '' });

  const changePassword = useMutation({
    mutationFn: () => authApi.changePassword(form.current, form.next),
    onSuccess: (res) => { toast.success(res.message); setForm({ current: '', next: '' }); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const logoutAll = useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: (res) => { toast.success(res.message); logout(); navigate('/'); },
  });

  return (
    <div className="space-y-5">
      <Card className="p-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-body">Security status</h3>
          <p className="text-sm text-muted mt-0.5">Your account is protected with hashed passwords and rotated sessions.</p>
        </div>
        <Badge tone="live" label="Protected" />
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-body mb-4 flex items-center gap-2"><Lock size={16} className="text-cyan" /> Change password</h3>
        <div className="space-y-4">
          <Input label="Current password" type="password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
          <Input label="New password" type="password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
          <Button size="sm" loading={changePassword.isPending} disabled={!form.current || form.next.length < 8} onClick={() => changePassword.mutate()}>Update password</Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-body mb-2">Active sessions</h3>
        <p className="text-sm text-muted mb-4">Sign out of every device except this one or all devices.</p>
        <Button variant="secondary" icon={LogOut} loading={logoutAll.isPending} onClick={() => logoutAll.mutate()}>Logout all devices</Button>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-body mb-2">Google account</h3>
        <p className="text-sm text-muted">Google sign-in is available when the server is configured with Google OAuth credentials.</p>
      </Card>
    </div>
  );
}

function PrivacyTab() {
  const navigate = useNavigate();
  const toast = useToast();
  const { logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const deleteAccount = useMutation({
    mutationFn: () => userApi.deleteMe(),
    onSuccess: (res) => { toast.success(res.message); logout(); navigate('/'); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h3 className="font-semibold text-body mb-2">Trip sharing</h3>
        <p className="text-sm text-muted">Trips are private by default. Shared trips use unguessable tokens and are view-only.</p>
      </Card>
      <Card className="p-5 border-danger/20">
        <h3 className="font-semibold text-danger mb-2">Delete account</h3>
        <p className="text-sm text-muted mb-4">Permanently deletes your account, trips, expenses, favorites, conversations and location data. This cannot be undone.</p>
        <Button variant="danger" icon={Trash2} onClick={() => setConfirmOpen(true)}>Delete my account</Button>
      </Card>

      <Modal open={confirmOpen} onClose={() => { setConfirmOpen(false); setConfirmText(''); }} title="Delete your account?" subtitle="This requires additional confirmation.">
        <p className="text-sm text-muted">Type <strong className="text-danger">DELETE</strong> to confirm permanent deletion of your account and all data.</p>
        <Input className="mt-4" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" />
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={() => { setConfirmOpen(false); setConfirmText(''); }}>Cancel</Button>
          <Button variant="danger" className="flex-1" loading={deleteAccount.isPending} disabled={confirmText !== 'DELETE'} onClick={() => deleteAccount.mutate()}>Delete Account</Button>
        </div>
      </Modal>
    </div>
  );
}

function LocationTab() {
  const toast = useToast();
  const [tracking, setTracking] = useState(false);
  const [history, setHistory] = useState(true);

  const deleteHistory = useMutation({
    mutationFn: () => locationApi.deleteHistory(),
    onSuccess: (res) => toast.success(res.message),
  });

  return (
    <div className="space-y-5">
      <Card className="p-5 space-y-5">
        <Switch checked={tracking} onChange={setTracking} label="Live location tracking" description="Off by default. Only active while Live Trip Mode is running." />
        <Switch checked={history} onChange={setHistory} label="Location history" description="Keep a short history for distance & progress. Older points expire automatically." />
        <div className="pt-3 border-t border-white/[0.08]">
          <h3 className="font-semibold text-body mb-2">Delete location history</h3>
          <p className="text-sm text-muted mb-3">Remove every stored location point from our servers. Your trips are not affected.</p>
          <Button variant="danger" loading={deleteHistory.isPending} onClick={() => deleteHistory.mutate()}>Delete Location History</Button>
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({ tripReminder: true, budget: true, transport: true, ai: true });
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));
  return (
    <Card className="p-5 space-y-5">
      <Switch checked={prefs.tripReminder} onChange={() => toggle('tripReminder')} label="Trip reminders" description="Reminders before upcoming trips." />
      <Switch checked={prefs.budget} onChange={() => toggle('budget')} label="Budget alerts" description="When spending approaches your budget." />
      <Switch checked={prefs.transport} onChange={() => toggle('transport')} label="Transport updates" description="Only when verified provider data is available." />
      <Switch checked={prefs.ai} onChange={() => toggle('ai')} label="AI recommendations" description="Personalised suggestions for your trips." />
    </Card>
  );
}

function AITab() {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h3 className="font-semibold text-body mb-2 flex items-center gap-2"><Sparkles size={16} className="text-cyan" /> AI trip generation</h3>
        <p className="text-sm text-muted">YatraGenie uses a deterministic demo planner when no Gemini key is configured, and Google Gemini (server-side only) when a key is present.</p>
        <div className="flex items-center gap-2 mt-4">
          <Badge tone="ai" label="AI-generated content is always labelled" />
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold text-body mb-2">Data trust</h3>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex gap-2"><Check size={15} className="text-success shrink-0" /> AI estimates are never shown as verified live data.</li>
          <li className="flex gap-2"><Check size={15} className="text-success shrink-0" /> Live availability appears only when a verified provider is connected.</li>
        </ul>
      </Card>
    </div>
  );
}
