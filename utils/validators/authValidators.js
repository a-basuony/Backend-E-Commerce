const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/user.model");

exports.signupValidators = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Name must be less than 30 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .toLowerCase()
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("Email already exists");
      }

      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .isLength({ max: 30 })
    .withMessage("Password must be less than 30 characters long")
    .custom(async (val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required"),

  validatorMiddleware,
];

exports.loginValidators = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .toLowerCase(),
  check("password").notEmpty().withMessage("Password is required"),
  validatorMiddleware,
];
