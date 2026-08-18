import AuthLayout from '../../components/layout/AuthLayout.jsx';
import ForgotPasswordForm from '../../features/auth/components/ForgotPasswordForm.jsx';

export default function ForgotPassword() {
  return (
    <AuthLayout title="Reset password" subtitle="We’ll email a reset link when mail is configured.">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
