import AuthLayout from '../../components/layout/AuthLayout.jsx';
import SignupForm from '../../features/auth/components/SignupForm.jsx';

export default function Signup() {
  return (
    <AuthLayout title="Create your account" subtitle="Email + strong password, or Google when configured.">
      <SignupForm />
    </AuthLayout>
  );
}
