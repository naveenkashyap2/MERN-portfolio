let toasts = [];
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn(toasts));
}

export function subscribeToasts(fn) {
  listeners.add(fn);
  fn(toasts);
  return () => listeners.delete(fn);
}

export function toast(message, type = 'info') {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, message, type }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3600);
}

export const uiStore = { toast };
