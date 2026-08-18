import { randomBytes } from 'node:crypto';

const ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';

function encode(bytes) {
  let out = '';
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

/** Short, URL-safe, unguessable id (used for share tokens, sessions, etc.). */
export function createId(prefix = '', size = 10) {
  return `${prefix}${encode(randomBytes(size))}`;
}

/** Longer random token for refresh tokens / share links. */
export function createToken(size = 24) {
  return randomBytes(size).toString('base64url');
}
