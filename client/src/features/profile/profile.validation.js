export function validateProfile(form) {
  const errors = {};
  if (!form.name || form.name.trim().length < 2) errors.name = 'Please enter your name.';
  return errors;
}
