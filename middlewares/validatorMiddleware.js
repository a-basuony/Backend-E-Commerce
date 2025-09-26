const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

// @desc    Find the first validation error in the request
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array()[0].msg, 400));
  }
  next();
};

module.exports = validatorMiddleware;
