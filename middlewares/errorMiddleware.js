const ApiError = require("../utils/apiError");

// 404 Error handling middleware
const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const env = process.env.NODE_ENV || "development";

  const handleJwtError = (err) => {
    if (err.name === "JsonWebTokenError") {
      return new ApiError("Invalid token. Please login again.", 401);
    }
    if (err.name === "TokenExpiredError") {
      return new ApiError("Your token has expired. Please login again.", 401);
    }
    return err;
  };

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
    err = handleJwtError(err);
    console.error("🔥 Error:", err.message);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

module.exports = { notFound, globalError };
