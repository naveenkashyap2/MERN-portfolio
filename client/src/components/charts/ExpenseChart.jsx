import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { EXPENSE_CATEGORIES } from '../../constants/trip';

const COLOR_MAP = Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c.value, c.color]));

export default function ExpenseChart({ data = {}, height = 220 }) {
  const items = Object.entries(data)
    .filter(([, v]) => Number(v) > 0)
    .map(([key, value]) => ({
      name: EXPENSE_CATEGORIES.find((c) => c.value === key)?.label || key,
      value: Number(value),
      key,
    }));

  if (!items.length) {
    return <div className="text-sm text-muted text-center py-10">No expenses yet.</div>;
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={items} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={3} strokeWidth={0}>
            {items.map((entry) => (
              <Cell key={entry.key} fill={COLOR_MAP[entry.key] || '#94A3B8'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#172033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
            formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
