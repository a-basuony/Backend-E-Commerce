const ApiError = require("../utils/apiError");

// 404 Error handling middleware
const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const env = process.env.NODE_ENV || "development";

  if (env === "development") {
    console.error("🔥 Error:", err);

    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production
    // Allow logging of errors in production for now to debug Vercel issues
    // console.error("🔥 Error (Production):", err);
    // console.error("🔥 Stack (Production):", err.stack);

    if (err.name === "JsonWebTokenError")
      err = new ApiError("Invalid token. Please login again.", 401);
    if (err.name === "TokenExpiredError")
      err = new ApiError("Your token has expired. Please login again.", 401);

    // Send generic message unless it's operational
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or other unknown error: don't leak details to client
      console.error("🔥 Error (Production):", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};

module.exports = { notFound, globalError };
