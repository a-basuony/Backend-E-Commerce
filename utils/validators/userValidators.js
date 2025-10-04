const slugify = require("slugify");
const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/user.model");

exports.getUserValidators = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.updateUserValidators = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  check("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("User name must be less than 30 characters long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .isEmail()
    .withMessage("User email is invalid")
    .toLowerCase()
    .optional()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id !== req.params.id) {
        throw new Error("User email already exists");
      }
      return true;
    }),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("User password must be at least 6 characters long")
    .isLength({ max: 30 })
    .withMessage("User password must be less than 30 characters long"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("User role is invalid"),
  validatorMiddleware,
];

exports.deleteUserValidators = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.createUserValidators = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("User name must be less than 30 characters long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is invalid")
    .toLowerCase()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });

      if (user) {
        throw new Error("User email already exists");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("User password must be at least 6 characters long")
    .isLength({ max: 30 })
    .withMessage("User password must be less than 30 characters long"),

  check("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("User phone is invalid"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("User role is invalid"),
  validatorMiddleware,
];
