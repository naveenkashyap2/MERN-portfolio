import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

export default function ConfirmDialog({ open, title, body, confirm = 'Delete', danger, onConfirm, onClose, loading }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm text-ink-mute">{body}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>
          {confirm}
        </Button>
      </div>
    </Modal>
  );
}
