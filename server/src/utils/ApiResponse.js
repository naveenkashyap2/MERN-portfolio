/**
 * Standard envelope for every successful API response.
 * Errors use the inverse shape (see error.middleware.js).
 */
export function send(res, statusCode, data, meta) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function ok(res, data, meta) {
  return send(res, 200, data, meta);
}

export function created(res, data, meta) {
  return send(res, 201, data, meta);
}

export function noContent(res) {
  return res.status(204).end();
}
