import { useState } from 'react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { authApi } from '../auth.api.js';
import { toast } from '../../../store/ui.store.js';
import { errorMessage } from '../../../utils/errorHandler.js';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.forgot(email);
      setDevToken(res.data?.resetToken || '');
      toast('If that email exists, we sent reset instructions.', 'success');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit" className="w-full" loading={loading}>
        Send reset link
      </Button>
      {devToken && (
        <p className="break-all text-xs text-ink-mute">
          Dev reset token: <a className="text-accent-cyan" href={`/reset-password?token=${devToken}`}>{devToken}</a>
        </p>
      )}
    </form>
  );
}
