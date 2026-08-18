import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Central error handler. Never leaks stack traces, database details, or
 * internal paths to clients in production.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let error = err;

  if (err instanceof ZodError) {
    error = new ApiError(400, 'Some information is missing or invalid.', {
      issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }

  if (err.type === 'entity.parse.failed') {
    error = new ApiError(400, 'The request body is not valid JSON.');
  }

  if (!(error instanceof ApiError)) {
    // Unknown / programming error — log fully, respond generically.
    logger.error('[unhandled]', req.method, req.originalUrl, err);
    const message = env.isProd ? 'Something went wrong.' : `Something went wrong. (${err.message})`;
    error = new ApiError(500, message, undefined, false);
  } else if (error.statusCode >= 500) {
    logger.error('[server]', req.method, req.originalUrl, error.message);
  }

  const status = error.statusCode || 500;
  res.status(status).json({
    success: false,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
    requestId: req.id || undefined,
  });
}
