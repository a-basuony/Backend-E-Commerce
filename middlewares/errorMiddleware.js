const ApiError = require("../utils/apiError");

// 404 Error handling middleware
const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

// // Global Error handling middleware
// const errorHandler = (error, req, res, next) => {
//   const statusCode = error.statusCode || 500;
//   const env = process.env.NODE_ENV || "development";

//   // Log errors (always log in development, log only serious ones in production)
//   if (env === "development") {
//     console.error("🔥 Error:", error);
//   } else {
//     console.error("🔥 Error:", error.message);
//   }

//   // Response structure
//   const response = {
//     status:
//       error.status ||
//       (statusCode >= 400 && statusCode < 500 ? "fail" : "error"),
//     message: error.message || "Internal Server Error",
//   };

//   // Include stack trace ONLY in development
//   if (env === "development") {
//     response.stack = error.stack;
//   }

//   res.status(statusCode).json(response);
// };

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const env = process.env.NODE_ENV || "development";

  // Log errors (always log in development, log only serious ones in production)
  if (env === "development") {
    console.error("🔥 Error:", err);
  } else {
    console.error("🔥 Error:", err.message);
  }

  if (env === "development") {
    sendErrorForDev(err, res);
  } else {
    sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = { notFound, globalError };
