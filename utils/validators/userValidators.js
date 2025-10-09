const slugify = require("slugify");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

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

  check("profileImage").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "User phone is invalid only accepted Egy and SA phone numbers"
    ),
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
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("User password must be at least 6 characters long")
    .isLength({ max: 30 })
    .withMessage("User password must be less than 30 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Password and confirm password do not match");
      }
      return true;
    }),

  check("profileImage").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "User phone is invalid only accepted Egy and SA phone numbers"
    ),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("User role is invalid"),
  validatorMiddleware,
];

exports.changePasswordValidators = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .custom(async (val, { req }) => {
      // 1. verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }

      // compare current password with hashed password
      const isPasswordCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        throw new Error("Current password is incorrect");
      }

      // 2. verify new password with confirm password

      if (val !== req.body.confirmPassword) {
        throw new Error("Password and confirm password do not match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
  validatorMiddleware,
];

exports.updateLoggedUserDataValidator = [
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
      if (user) {
        throw new Error("User email already exists");
      }
      return true;
    }),

  check("profileImage").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "User phone is invalid only accepted Egy and SA phone numbers"
    ),
  validatorMiddleware,
];
