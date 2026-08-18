import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#06B6D4', '#22C55E', '#F59E0B', '#A78BFA', '#94A3B8'];

export default function BudgetChart({ data = [] }) {
  const rows = data.filter((d) => d.value > 0);
  if (!rows.length) return <p className="text-sm text-ink-mute">Nothing here yet.</p>;
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={3}>
            {rows.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
