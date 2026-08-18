import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { authApi } from '../auth.api.js';
import { validateLogin } from '../auth.validation.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { errorMessage } from '../../../utils/errorHandler.js';
import { toast } from '../../../store/ui.store.js';
import GoogleAuth from './GoogleAuth.jsx';

export default function LoginForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validateLogin(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const res = await authApi.login(form);
      setUser(res.data.user);
      toast('Signed in.', 'success');
      navigate(params.get('next') || '/dashboard');
    } catch (err) {
      toast(errorMessage(err, 'Invalid email or password.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Password" type="password" autoComplete="current-password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <div className="flex justify-end">
        <Link to="/forgot-password" className="text-xs text-accent-cyan">
          Forgot Password
        </Link>
      </div>
      <Button type="submit" className="w-full" loading={loading}>
        Login
      </Button>
      <GoogleAuth />
      <p className="text-center text-sm text-ink-mute">
        New here?{' '}
        <Link to="/register" className="text-accent-cyan">
          Register
        </Link>
      </p>
    </form>
  );
}
