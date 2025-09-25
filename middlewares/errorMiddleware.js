const ApiError = require("../utils/apiError");

// 404 Error handling middleware
const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

// Global Error handling middleware
const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const env = process.env.NODE_ENV || "development";

  // Log errors (always log in development, log only serious ones in production)
  if (env === "development") {
    console.error("🔥 Error:", error);
  } else {
    console.error("🔥 Error:", error.message);
  }

  // Response structure
  const response = {
    status:
      error.status ||
      (statusCode >= 400 && statusCode < 500 ? "fail" : "error"),
    message: error.message || "Internal Server Error",
  };

  // Include stack trace ONLY in development
  if (env === "development") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
