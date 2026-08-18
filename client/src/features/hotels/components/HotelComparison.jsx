export default function HotelComparison({ items = [] }) {
  if (items.length < 2) return null;
  return (
    <div className="card overflow-x-auto p-4">
      <table className="w-full text-left text-sm">
        <thead className="text-ink-mute">
          <tr>
            <th className="p-2">Stay</th>
            <th className="p-2">Band</th>
            <th className="p-2">Estimate</th>
            <th className="p-2">Trust</th>
          </tr>
        </thead>
        <tbody>
          {items.map((h) => (
            <tr key={h.id} className="border-t border-white/5">
              <td className="p-2">{h.name}</td>
              <td className="p-2 capitalize">{h.category}</td>
              <td className="p-2">₹{h.estimatedPrice || '—'}</td>
              <td className="p-2">{h.trust}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
