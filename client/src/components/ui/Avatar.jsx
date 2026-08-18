import { cn } from '../../utils/cn';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join('');
}

export default function Avatar({ name, src, size = 40, className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={cn('rounded-full object-cover border border-white/10', className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-body bg-gradient-to-br from-brand-600 to-cyan shrink-0',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
