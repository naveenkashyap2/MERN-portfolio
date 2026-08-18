export function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

export function passwordErrors(v) {
  const value = String(v || '');
  const rules = [
    [value.length >= 8, 'At least 8 characters'],
    [/[A-Z]/.test(value), 'One uppercase letter'],
    [/[a-z]/.test(value), 'One lowercase letter'],
    [/\d/.test(value), 'One number'],
    [/[^A-Za-z0-9]/.test(value), 'One special character'],
  ];
  return rules.filter(([ok]) => !ok).map(([, msg]) => msg);
}
