/**
 * @class ApiError
 * @extends Error
 * @description
 * Custom error class for handling **operational errors** in a MERN stack API.
 * Operational errors are predictable errors (like invalid input, resource not found, or duplicate data)
 * that can be safely sent to the client. This class helps standardize error messages and status codes.
 *
 * @example
 * // Throw a 404 error if category is not found
 * throw new ApiError("Category not found", 404);
 */
class ApiError extends Error {
  /**
   * @param {string} message - Human-readable error message to send to client
   * @param {number} statusCode - HTTP status code (default: 500)
   */
  constructor(message, statusCode = 500) {
    super(message); // Initialize the built-in Error with the message

    /**
     * @property {number} statusCode - HTTP status code
     */
    this.statusCode = statusCode;

    /**
     * @property {string} status - Short status: 'fail' for 4xx, 'error' for 5xx
     */
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    /**
     * @property {boolean} isOperational - Marks this as an operational error (predictable)
     */
    this.isOperational = true;

    /**
     * Capture stack trace excluding this constructor for cleaner logs
     * @see https://nodejs.org/api/errors.html#errors_error_capturestacktrace_targetobject_constructoropt
     */
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
