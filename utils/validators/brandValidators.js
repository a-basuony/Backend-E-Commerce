const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBrandValidators = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];

exports.createBrandValidators = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Brand name must be less than 30 characters long"),
  validatorMiddleware,
];

exports.updateBrandValidators = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  check("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Brand name must be less than 30 characters long"),
  validatorMiddleware,
];

exports.deleteBrandValidators = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];
