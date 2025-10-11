const Review = require("../models/review.model");
const factory = require("./handlersFactory");

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// @desc    create review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = factory.createOne(Review);

// @desc    Update review by ID
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = factory.updateOne(Review);

// @desc    Delete review by ID
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = factory.deleteOne(Review);
