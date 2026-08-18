/**
 * Operational error carrying an HTTP status code.
 * Non-operational (unknown) errors are treated as 500s by the error middleware.
 */
export default class ApiError extends Error {
  constructor(statusCode, message, details = undefined, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    this.success = false;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = 'Bad request', details) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'You need to be signed in to do that.') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'You are not allowed to do that.') {
    return new ApiError(403, message);
  }

  static notFound(message = 'We could not find that.') {
    return new ApiError(404, message);
  }

  static conflict(message = 'That already exists.') {
    return new ApiError(409, message);
  }

  static tooMany(message = 'Too many requests. Please slow down.') {
    return new ApiError(429, message);
  }
}
