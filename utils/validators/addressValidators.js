const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Address alias is required")
    .isString()
    .withMessage("Alias must be a string")
    .isLength({ min: 2 })
    .withMessage("Alias must be at least 2 characters"),

  check("details")
    .notEmpty()
    .withMessage("Address details are required")
    .isString()
    .withMessage("Details must be a string"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone(["ar-EG", "en-US", "ar-SA"])
    .withMessage("Invalid phone number"),

  check("city").optional().isString().withMessage("City must be a string"),

  check("postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Invalid postal code format"),

  validatorMiddleware,
];

exports.updateAddressValidator = [
  check("alias").optional().isString().withMessage("Alias must be a string"),
  check("details")
    .optional()
    .isString()
    .withMessage("Details must be a string"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "en-US"])
    .withMessage("Invalid phone number"),
  check("city").optional().isString(),
  check("postalCode").optional().isPostalCode("any"),
  validatorMiddleware,
];
