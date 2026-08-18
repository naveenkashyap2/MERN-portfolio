import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { authApi } from '../auth.api.js';
import { validateSignup } from '../auth.validation.js';
import { passwordErrors } from '../../../utils/validators.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { errorMessage } from '../../../utils/errorHandler.js';
import { toast } from '../../../store/ui.store.js';
import GoogleAuth from './GoogleAuth.jsx';

export default function SignupForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const strength = 5 - passwordErrors(form.password).length;

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validateSignup(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const res = await authApi.register({ name: form.name, email: form.email, password: form.password });
      setUser(res.data.user);
      toast('Account created. Welcome to YatraGenie.', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Password" type="password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-accent-cyan" style={{ width: `${(strength / 5) * 100}%` }} />
      </div>
      <Input label="Confirm Password" type="password" value={form.confirm} error={errors.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
      <Button type="submit" className="w-full" loading={loading}>
        Create account
      </Button>
      <GoogleAuth />
      <p className="text-center text-sm text-ink-mute">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-cyan">
          Login
        </Link>
      </p>
    </form>
  );
}
