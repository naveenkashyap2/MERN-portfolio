import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';

export default function ArrivalStatus({ open, place, onExplore, onNext, onBreak }) {
  return (
    <Modal open={open} title="You've arrived!" onClose={onNext}>
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 text-2xl">✓</div>
        <p className="mt-4 text-ink-mute">Welcome to {place || 'your stop'}.</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={onExplore}>Explore Place</Button>
          <Button variant="secondary" onClick={onNext}>
            Next Stop
          </Button>
          <Button variant="ghost" onClick={onBreak}>
            Take a Break
          </Button>
        </div>
      </div>
    </Modal>
  );
}
