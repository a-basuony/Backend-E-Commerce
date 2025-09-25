/**
 * @class ApiError
 * @extends Error
 * @description
 * Custom error class for handling **operational errors** in a MERN stack API.
 *
 * Operational errors are predictable (e.g., invalid input, resource not found, duplicate data)
 * and can be safely reported to the client. This class standardizes error messages,
 * status codes, and provides a flag to distinguish them from programming errors.
 *
 * @example
 * // Example: Throw a 404 error if a category is not found
 * throw new ApiError("Category not found", 404);
 */
class ApiError extends Error {
  /**
   * @param {string} message - Human-readable error message for the client
   * @param {number} [statusCode=500] - HTTP status code (defaults to 500)
   */
  constructor(message, statusCode = 500) {
    // Call the built-in Error constructor with the message
    super(message);

    // HTTP status code (e.g., 404, 400, 500)
    this.statusCode = statusCode;

    // Short status: "fail" for 4xx client errors, "error" for 5xx server errors
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";

    // Marks this error as "operational" (predictable and safe for client)
    this.isOperational = true;
  }
}

module.exports = ApiError;
