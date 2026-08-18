import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Navbar from '../../components/layout/Navbar.jsx';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-6xl">🧭</p>
        <h1 className="mt-4 text-3xl font-semibold">Looks like you've taken a wrong turn.</h1>
        <Button className="mt-6" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </main>
    </div>
  );
}
