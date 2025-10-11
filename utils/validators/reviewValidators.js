const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getReviewValidators = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  validatorMiddleware,
];

exports.createReviewValidators = [
  check("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Review name must be at least 3 characters long"),
  check("rating")
    .isNumeric()
    .withMessage("Review rating must be a number")
    .isInt({ min: 1 })
    .withMessage("Review rating must be at least 1")
    .isInt({ max: 5 })
    .withMessage("Review rating must be below 5"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("product").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

exports.updateReviewValidators = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  check("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Review name must be at least 3 characters long"),
  check("rating")
    .optional()
    .isNumeric()
    .withMessage("Review rating must be a number")
    .isInt({ min: 1 })
    .withMessage("Review rating must be at least 1")
    .isInt({ max: 5 })
    .withMessage("Review rating must be below 5"),
  check("user").optional().isMongoId().withMessage("Invalid user id format"),
  check("product")
    .optional()
    .isMongoId()
    .withMessage("Invalid product id format"),
  validatorMiddleware,
];

exports.deleteReviewValidators = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  validatorMiddleware,
];
