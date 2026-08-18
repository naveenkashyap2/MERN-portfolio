import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { authApi } from '../../features/auth/auth.api.js';
import { toast } from '../../store/ui.store.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.reset({ token: params.get('token'), password });
      toast('Password updated. Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      toast(err.response?.data?.message || 'Reset link is invalid.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Choose a new password" subtitle="Use 8+ characters with mixed case, a number, and a symbol.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full" loading={loading}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
