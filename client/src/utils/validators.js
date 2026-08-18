export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
}

export function passwordStrength(password = '') {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['text-danger', 'text-warning', 'text-brand-400', 'text-success'];
  return { score, label: labels[Math.max(0, score - 1)], color: colors[Math.max(0, score - 1)] };
}
