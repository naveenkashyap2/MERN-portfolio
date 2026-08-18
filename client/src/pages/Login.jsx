import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../lib/axios';
import { validateEmail } from '../utils/validators';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/dashboard';

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!validateEmail(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Enter your password.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'We could not sign you in.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="text-muted mt-1 text-sm">Sign in to continue planning your journeys.</p>

      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <Input label="Password" type="password" icon={Lock} placeholder="••••••••" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading} icon={Sparkles}>
          Login
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-xs text-muted">or</span>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <GoogleButton />

      <p className="text-sm text-muted text-center mt-8">
        New here?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
          Create an account
        </Link>
      </p>

      <div className="mt-6 rounded-xl bg-cyan/[0.06] border border-cyan/20 px-4 py-3 flex gap-2.5 text-xs text-muted">
        <Info size={14} className="text-cyan shrink-0 mt-0.5" />
        <span>
          <strong className="text-body">Demo account:</strong> demo@yatragenie.ai / Demo@1234
        </span>
      </div>
    </div>
  );
}

function GoogleButton() {
  const toast = useToast();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const onClick = () => {
    if (!clientId) {
      toast.info('Google sign-in is not configured in this demo — use email or the demo account.');
      return;
    }
    // In production this initialises Google Identity Services.
    toast.info('Google sign-in will be available when configured.');
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-11 rounded-xl bg-white/[0.05] border border-white/10 text-sm font-medium text-body flex items-center justify-center gap-2.5 hover:bg-white/[0.08] transition-colors"
    >
      <GoogleG size={17} /> Continue with Google
    </button>
  );
}

function GoogleG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
