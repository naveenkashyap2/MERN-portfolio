export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = "Resource not found";
    statusCode = 404;
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 409;
  }
  // Validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map(v => v.message).join(", ");
    statusCode = 400;
  }

  // Hide internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: err.code || "SERVER_ERROR",
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
};
