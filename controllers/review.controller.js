const Review = require("../models/review.model");
const factory = require("./handlersFactory");

// Nested route
// GET    api/v1/products/:productId/reviews
exports.setFilterObject = (req, res, next) => {
  let filter = {};
  if (req.params.productId) {
    filter = { product: req.params.productId };
  }
  req.filterObject = filter;
  next();
};

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// Nested route
// POST   api/v1/products/:productId/reviews
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
};

// @desc    create review
// @route   POST /api/v1/reviews
// @access  Private/ user
exports.createReview = factory.createOne(Review);

// @desc    Update review by ID
// @route   PUT /api/v1/reviews/:id
// @access  Private / user
exports.updateReview = factory.updateOne(Review);

// @desc    Delete review by ID
// @route   DELETE /api/v1/reviews/:id
// @access  Private /  protected /user or admin or manager
exports.deleteReview = factory.deleteOne(Review);
