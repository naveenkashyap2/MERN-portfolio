import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';

export default function LocationPermission({ open, onClose, onEnable }) {
  return (
    <Modal open={open} title="Turn on location to unlock Live Trip Mode." onClose={onClose}>
      <ul className="space-y-2 text-sm text-ink-mute">
        <li>✓ Live distance</li>
        <li>✓ Walking progress</li>
        <li>✓ Arrival detection</li>
        <li>✓ Better route guidance</li>
      </ul>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Maybe Later
        </Button>
        <Button onClick={onEnable}>Enable Location</Button>
      </div>
    </Modal>
  );
}
