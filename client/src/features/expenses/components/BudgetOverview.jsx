import BudgetChart from '../../../components/charts/BudgetChart.jsx';
import { inr } from '../../../utils/currency.js';
import Button from '../../../components/ui/Button.jsx';

export default function BudgetOverview({ summary, onOptimize }) {
  if (!summary) return null;
  const data = Object.entries(summary.byCategory || {}).map(([name, value]) => ({ name, value }));
  return (
    <div className="card p-5">
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-ink-mute">Total</p>
          <p className="text-lg font-semibold">{inr(summary.budget)}</p>
        </div>
        <div>
          <p className="text-ink-mute">Spent</p>
          <p className="text-lg font-semibold">{inr(summary.spent)}</p>
        </div>
        <div>
          <p className="text-ink-mute">Remaining</p>
          <p className="text-lg font-semibold">{inr(summary.remaining)}</p>
        </div>
      </div>
      {summary.warning && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
          You're close to your budget. {inr(summary.spent)} / {inr(summary.budget)}
          <Button className="mt-3" variant="secondary" onClick={onOptimize}>
            Optimize Budget
          </Button>
        </div>
      )}
      <div className="mt-4">
        <BudgetChart data={data} />
      </div>
    </div>
  );
}
