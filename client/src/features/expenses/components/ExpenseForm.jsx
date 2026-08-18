import { useState } from 'react';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import { EXPENSE_CATEGORIES } from '../../../constants/trip.js';

export default function ExpenseForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    amount: '',
    category: 'food',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  });
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...form, amount: Number(form.amount) });
      }}
    >
      <Input label="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
      <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {EXPENSE_CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </Select>
      <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <Button type="submit" loading={loading} className="w-full">
        Add Expense
      </Button>
    </form>
  );
}
