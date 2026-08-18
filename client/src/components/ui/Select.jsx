export default function Select({ label, error, id, children, className = '', ...props }) {
  return (
    <label className="block" htmlFor={id}>
      {label && <span className="label">{label}</span>}
      <select id={id} className={`input ${className}`} {...props}>
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}
