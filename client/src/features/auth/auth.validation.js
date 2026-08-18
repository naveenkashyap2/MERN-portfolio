import { isEmail, passwordErrors } from '../../utils/validators.js';

export function validateLogin({ email, password }) {
  const errors = {};
  if (!isEmail(email)) errors.email = 'Please enter a valid email.';
  if (!password) errors.password = 'Password is required.';
  return errors;
}

export function validateSignup({ name, email, password, confirm }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!isEmail(email)) errors.email = 'Please enter a valid email.';
  const pwd = passwordErrors(password);
  if (pwd.length) errors.password = pwd[0];
  if (password !== confirm) errors.confirm = 'Passwords do not match.';
  return errors;
}
