import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../lib/axios';
import { validateEmail, passwordStrength } from '../utils/validators';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Enter your name.';
    if (!validateEmail(form.email)) errs.email = 'Enter a valid email address.';
    if (strength.score < 4) errs.password = 'Use 8+ chars with upper, lower, number & symbol.';
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created — welcome aboard!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'We could not create your account.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="text-muted mt-1 text-sm">Start planning smarter journeys today.</p>

      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        <Input label="Name" icon={User} placeholder="Your name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <div>
          <Input label="Password" type="password" icon={Lock} placeholder="••••••••" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`h-1 w-8 rounded-full ${i < strength.score ? 'bg-brand-500' : 'bg-white/[0.1]'}`} />
                ))}
              </div>
              <span className={`text-xs ${strength.color}`}>{strength.label}</span>
            </div>
          )}
        </div>
        <Input label="Confirm password" type="password" icon={Lock} placeholder="••••••••" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} />
        <Button type="submit" className="w-full" size="lg" loading={loading} icon={Sparkles}>
          Register
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-xs text-muted">or</span>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <button
        type="button"
        onClick={() => toast.info('Google sign-in is not configured in this demo.')}
        className="w-full h-11 rounded-xl bg-white/[0.05] border border-white/10 text-sm font-medium text-body flex items-center justify-center gap-2.5 hover:bg-white/[0.08] transition-colors"
      >
        Continue with Google
      </button>

      <p className="text-sm text-muted text-center mt-8">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
