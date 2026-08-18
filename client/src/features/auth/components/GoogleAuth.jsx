import Button from '../../../components/ui/Button.jsx';
import { toast } from '../../../store/ui.store.js';

export default function GoogleAuth() {
  const configured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full"
      onClick={() => {
        if (!configured) toast('Google sign-in is not configured on this server yet.', 'warning');
      }}
    >
      Continue with Google
    </Button>
  );
}
