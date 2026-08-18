import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExpenseChart({ data = [] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
          <YAxis stroke="#94A3B8" fontSize={12} />
          <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)' }} />
          <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
