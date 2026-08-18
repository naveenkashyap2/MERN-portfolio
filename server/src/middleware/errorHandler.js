const { env } = require('../config/env');
const { logger } = require('../config/logger');
const { ApiError } = require('../utils/ApiError');

function notFound(req, res, next) {
  next(new ApiError(404, 'Route not found.', { code: 'NOT_FOUND' }));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.statusCode || err.status || 500;
  const isOperational = err instanceof ApiError || err.isOperational;

  logger.error('request_error', {
    requestId: req.requestId,
    status,
    code: err.code || 'ERROR',
    path: req.path,
    method: req.method,
  });

  const message =
    status >= 500 && env.isProd
      ? 'Something went wrong.'
      : isOperational
        ? err.message
        : env.isProd
          ? 'Something went wrong.'
          : err.message || 'Something went wrong.';

  res.status(status).json({
    success: false,
    message,
    code: err.code || (status >= 500 ? 'INTERNAL' : 'ERROR'),
    requestId: req.requestId,
    details: !env.isProd && err.details ? err.details : undefined,
  });
}

module.exports = { notFound, errorHandler };
