/**
 * Access tokens live in memory only (never localStorage), matching the
 * "short-lived access token + HttpOnly refresh cookie" model.
 */
let accessToken = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};
