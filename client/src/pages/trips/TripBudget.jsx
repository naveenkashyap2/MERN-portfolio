import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import ExpenseForm from '../../features/expenses/components/ExpenseForm.jsx';
import ExpenseList from '../../features/expenses/components/ExpenseList.jsx';
import BudgetOverview from '../../features/expenses/components/BudgetOverview.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import { useQuery } from '@tanstack/react-query';
import { expensesApi } from '../../features/expenses/expenses.api.js';
import { useExpenses } from '../../features/expenses/hooks/useExpenses.js';
import { aiApi } from '../../features/ai/ai.api.js';
import { toast } from '../../store/ui.store.js';

export default function TripBudget() {
  const { tripId } = useParams();
  const qc = useQueryClient();
  const { data: list } = useExpenses(tripId);
  const { data: summary } = useQuery({ queryKey: ['expense-summary', tripId], queryFn: () => expensesApi.summary(tripId) });
  const [open, setOpen] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['expenses', tripId] });
    qc.invalidateQueries({ queryKey: ['expense-summary', tripId] });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Budget</h1>
        <Button onClick={() => setOpen(true)}>Add Expense</Button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <BudgetOverview
          summary={summary}
          onOptimize={async () => {
            const next = Math.max(0, Math.round((summary?.budget || 0) * 0.7));
            await aiApi.budget(tripId, next);
            toast('Budget plan tightened.', 'success');
          }}
        />
        <ExpenseList
          items={list?.items}
          onDelete={async (e) => {
            await expensesApi.remove(tripId, e._id);
            refresh();
          }}
        />
      </div>
      <Modal open={open} title="Add expense" onClose={() => setOpen(false)}>
        <ExpenseForm
          onSubmit={async (body) => {
            await expensesApi.add(tripId, body);
            setOpen(false);
            refresh();
            toast('Expense added.', 'success');
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}
