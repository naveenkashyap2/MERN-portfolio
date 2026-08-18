export default function Input({ label, error, id, className = '', ...props }) {
  return (
    <label className="block" htmlFor={id}>
      {label && <span className="label">{label}</span>}
      <input id={id} className={`input ${error ? 'border-red-400' : ''} ${className}`} {...props} />
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}
