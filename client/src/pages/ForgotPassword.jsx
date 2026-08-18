import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { authApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../lib/axios';
import { validateEmail } from '../utils/validators';

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authApi.forgotPassword(email);
      setResult(res);
      toast.success('Check your email for the reset link.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <p className="text-muted mt-1 text-sm">We'll send a reset link to your email.</p>

      {result ? (
        <div className="mt-8 rounded-xl bg-success/[0.07] border border-success/25 p-4 text-sm text-body">
          <p>{result.message}</p>
          {result.demoToken && (
            <p className="mt-2 text-xs text-muted">
              Demo mode: your reset token is <code className="text-cyan">{result.demoToken}</code>
            </p>
          )}
          <Link to="/login" className="inline-block mt-4 text-brand-400 hover:text-brand-300 text-sm font-medium">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <Button type="submit" className="w-full" size="lg" loading={loading} icon={KeyRound}>
            Send Reset Link
          </Button>
        </form>
      )}

      <p className="text-sm text-muted text-center mt-8">
        Remembered it?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
