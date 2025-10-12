const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Review = require("../../models/review.model");

exports.getReviewValidators = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  validatorMiddleware,
];

exports.createReviewValidators = [
  check("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Review name must be at least 3 characters long"),
  check("rating")
    .notEmpty()
    .withMessage("Review rating is required")
    .isNumeric()
    .withMessage("Review rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review rating must be at least 1 and below 5"),

  check("product")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (productId, { req }) => {
      // check if product exist
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Invalid product id format ${productId}`);
      }
      // check if logged user review for this product before // it allow to review one time for this product
      const review = await Review.findOne({
        user: req.user.id,
        product: productId,
      });
      if (review) {
        throw new Error("You have already reviewed this product before");
      }

      return true;
    }),
  check("user").custom(async (val, { req }) => {
    // check if user exist
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new Error(`Invalid user id format ${req.user.id}`);
    }
    // add user id to req.body object
    req.body.user = req.user._id;
    return true;
  }),
  validatorMiddleware,
];

exports.updateReviewValidators = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom(async (id, { req }) => {
      // check if review exist
      const review = await Review.findById(id);
      if (!review) {
        throw new Error(`Invalid review id format ${id}`);
      }
      // check review belong to logged user
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("You are not allowed to update this review");
      }
      return true;
    }),
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
  check("user")
    .optional()
    .isMongoId()
    .withMessage("Invalid user id format")
    .custom(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`Invalid user id format ${userId}`);
      }
      return true;
    }),
  check("product")
    .optional()
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (productId) => {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Invalid product id format ${productId}`);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteReviewValidators = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom(async (id, { req }) => {
      // check if review exist
      const review = await Review.findById(id);
      if (!review) {
        throw new Error(`Invalid review id format ${id}`);
      }
      // check review belong to logged user
      if (req.user.role === "user") {
        if (review.user.toString() !== req.user.id.toString()) {
          throw new Error("You are not allowed to delete this review");
        }
        return true;
      }
    }),
  validatorMiddleware,
];
