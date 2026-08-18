import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { EXPENSE_CATEGORIES } from '../../constants/trip';

export default function BudgetChart({ data = {}, height = 240 }) {
  const items = EXPENSE_CATEGORIES.map((c) => ({
    name: c.label,
    value: Number(data[c.value] || 0),
    fill: c.color,
  }));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{ background: '#172033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
            formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`]}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={42}>
            {items.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
