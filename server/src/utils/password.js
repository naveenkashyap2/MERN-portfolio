const bcrypt = require('bcryptjs');

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function validatePassword(password) {
  if (typeof password !== 'string' || !PASSWORD_RULE.test(password)) {
    return {
      ok: false,
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
    };
  }
  return { ok: true };
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password, passwordHash) {
  if (!passwordHash) return false;
  return bcrypt.compare(password, passwordHash);
}

module.exports = { validatePassword, hashPassword, verifyPassword, PASSWORD_RULE };
