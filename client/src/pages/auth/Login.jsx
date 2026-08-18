import AuthLayout from '../../components/layout/AuthLayout.jsx';
import LoginForm from '../../features/auth/components/LoginForm.jsx';

export default function Login() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to plan and track your India trips.">
      <LoginForm />
    </AuthLayout>
  );
}
