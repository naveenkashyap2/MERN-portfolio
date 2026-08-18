import { inr } from '../../../utils/currency.js';

export default function ExpenseCard({ expense, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
      <div>
        <p className="font-medium">{inr(expense.amount)}</p>
        <p className="text-xs capitalize text-ink-mute">{expense.category} · {expense.description}</p>
      </div>
      <button type="button" className="text-xs text-red-300" onClick={() => onDelete?.(expense)}>
        Delete
      </button>
    </div>
  );
}
