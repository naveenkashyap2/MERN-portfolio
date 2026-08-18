import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { getCurrentPosition } from '../../../services/location.service.js';
import { toast } from '../../../store/ui.store.js';

export default function DestinationInput({ draft, setDraft }) {
  const swap = () => setDraft((d) => ({ ...d, origin: d.destination, destination: d.origin }));

  const useMine = async () => {
    try {
      toast('Locating...', 'info');
      await getCurrentPosition();
      setDraft((d) => ({ ...d, origin: d.origin || 'Delhi' }));
      toast('Location detected — confirm your city name.', 'success');
    } catch (err) {
      if (err.code === 1) toast('Permission denied', 'warning');
      else toast('Location unavailable', 'warning');
    }
  };

  return (
    <div className="space-y-4">
      <Input label="From" value={draft.origin} onChange={(e) => setDraft({ ...draft, origin: e.target.value })} />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={swap}>
          Swap Locations
        </Button>
        <Button variant="ghost" onClick={useMine}>
          Use my location
        </Button>
      </div>
      <Input label="To" value={draft.destination} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} />
    </div>
  );
}
