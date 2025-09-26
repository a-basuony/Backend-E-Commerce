const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

// @desc    Find the first validation error in the request
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return next(new ApiError(errors.array(), 400));
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validatorMiddleware;
