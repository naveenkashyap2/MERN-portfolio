import Button from './Button.jsx';

export default function EmptyState({ title, body, action, onAction }) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 text-4xl" aria-hidden>
        ✈
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-mute">{body}</p>
      {action && (
        <Button className="mt-6" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}
