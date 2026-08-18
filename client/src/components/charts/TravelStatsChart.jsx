import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TravelStatsChart({ data = [] }) {
  return (
    <div className="h-48">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
          <YAxis stroke="#94A3B8" fontSize={12} />
          <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)' }} />
          <Line type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
