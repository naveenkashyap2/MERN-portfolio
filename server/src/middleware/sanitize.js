const { stripMongo } = require('../utils/sanitize');

function sanitizeRequest(req, _res, next) {
  if (req.body && typeof req.body === 'object') req.body = stripMongo(req.body);
  if (req.query && typeof req.query === 'object') req.query = stripMongo(req.query);
  if (req.params && typeof req.params === 'object') req.params = stripMongo(req.params);
  next();
}

module.exports = { sanitizeRequest };
