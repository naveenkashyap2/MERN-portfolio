const { randomUUID } = require('crypto');

function requestId(req, res, next) {
  const incoming = req.header('X-Request-ID');
  const id = incoming && /^[A-Za-z0-9-]{8,80}$/.test(incoming) ? incoming : randomUUID();
  req.requestId = id;
  res.locals.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
}

module.exports = { requestId };
