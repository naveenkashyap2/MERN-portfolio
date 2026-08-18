import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Plus, Trash2, Sparkles } from 'lucide-react';
import { expensesApi, tripsApi, aiApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/Progress';
import ExpenseChart from '../components/charts/ExpenseChart';
import BudgetChart from '../components/charts/BudgetChart';
import { EXPENSE_CATEGORIES } from '../constants/trip';
import { formatINR } from '../utils/currency';
import { getErrorMessage } from '../lib/axios';

export default function Budget() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ amount: '', category: 'food', description: '' });

  const { data: tripData } = useQuery({ queryKey: ['trip', tripId], queryFn: () => tripsApi.get(tripId) });
  const { data: summary } = useQuery({ queryKey: ['expense-summary', tripId], queryFn: () => expensesApi.summary(tripId) });
  const { data: listData } = useQuery({ queryKey: ['expenses', tripId], queryFn: () => expensesApi.list(tripId) });

  const trip = tripData?.trip;

  const addExpense = useMutation({
    mutationFn: (payload) => expensesApi.create(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
      queryClient.invalidateQueries({ queryKey: ['expense-summary', tripId] });
      toast.success('Expense added.');
      setAddOpen(false);
      setForm({ amount: '', category: 'food', description: '' });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const removeExpense = useMutation({
    mutationFn: (id) => expensesApi.remove(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
      queryClient.invalidateQueries({ queryKey: ['expense-summary', tripId] });
      toast.success('Expense removed.');
    },
  });

  const optimize = useMutation({
    mutationFn: () => aiApi.budgetOptimize(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      toast.success('Budget optimized by AI.');
    },
  });

  const expenses = listData?.expenses || [];
  const s = summary || { budget: trip?.budget || 0, spent: 0, remaining: 0, byCategory: {}, percentUsed: 0 };
  const pct = s.percentUsed || 0;

  return (
    <div>
      <button onClick={() => navigate(`/trips/${tripId}`)} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body mb-4">
        <ArrowLeft size={15} /> Back to trip
      </button>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Budget</h1>
          <p className="text-muted mt-1 text-sm">{trip?.origin} → {trip?.destination}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Sparkles} loading={optimize.isPending} onClick={() => optimize.mutate()}>Optimize Budget</Button>
          <Button icon={Plus} onClick={() => setAddOpen(true)}>Add Expense</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatCard icon={Wallet} label="Total Budget" value={formatINR(s.budget)} tone="text-brand-400" />
        <StatCard icon={TrendingUp} label="Spent" value={formatINR(s.spent)} tone="text-warning" />
        <StatCard icon={TrendingDown} label="Remaining" value={formatINR(s.remaining)} tone="text-success" />
      </div>

      {pct >= 80 && (
        <div className="rounded-xl bg-warning/[0.08] border border-warning/30 px-4 py-3 flex items-center justify-between mb-6">
          <p className="text-sm text-warning font-medium">You're close to your budget. {formatINR(s.spent)} / {formatINR(s.budget)}</p>
          <Button size="sm" variant="secondary" onClick={() => optimize.mutate()}>Optimize Budget</Button>
        </div>
      )}

      <Card className="p-5 mb-6">
        <ProgressBar value={s.spent} max={s.budget} tone={pct >= 80 ? 'warning' : 'brand'} />
        <p className="text-xs text-muted mt-2">{pct}% of budget used</p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="font-semibold text-body mb-2">Spending by category</h3>
          <ExpenseChart data={s.byCategory} />
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-body mb-2">Planned breakdown</h3>
          <BudgetChart data={trip?.budgetBreakdown || s.byCategory} />
        </Card>
      </div>

      {/* Expense list */}
      <Card className="p-5">
        <h3 className="font-semibold text-body mb-4">Expenses ({expenses.length})</h3>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted text-center py-6">Start tracking your trip expenses.</p>
        ) : (
          <div className="space-y-2">
            {expenses.map((e) => {
              const cat = EXPENSE_CATEGORIES.find((c) => c.value === e.category);
              return (
                <div key={e.id} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-ink-900/50 px-4 py-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat?.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-body truncate">{e.description || cat?.label}</p>
                    <p className="text-[11px] text-muted capitalize">{e.category} · {new Date(e.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <p className="text-sm font-semibold text-body">{formatINR(e.amount)}</p>
                  <button onClick={() => removeExpense.mutate(e.id)} className="p-1.5 text-muted hover:text-danger" aria-label="Delete expense"><Trash2 size={15} /></button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add expense"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={() => addExpense.mutate({ ...form, amount: Number(form.amount) })} loading={addExpense.isPending}>Add Expense</Button></>}
      >
        <div className="space-y-4">
          <Input label="Amount (₹)" type="number" min={1} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="500" />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </Select>
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Lunch at Taj Ganj" />
        </div>
      </Modal>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <Card className="p-4 sm:p-5">
      <span className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-3">
        <Icon size={16} className={tone} />
      </span>
      <p className="text-[11px] text-muted">{label}</p>
      <p className="text-lg sm:text-xl font-bold text-body">{value}</p>
    </Card>
  );
}
