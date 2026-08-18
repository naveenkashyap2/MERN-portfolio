export default function AIMessage({ role, children }) {
  const mine = role === 'user';
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${mine ? 'bg-accent/25' : 'bg-white/5'}`}>{children}</div>
    </div>
  );
}
