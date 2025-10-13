const handlersFactory = require("./handlersFactory");
const Coupon = require("../models/coupon.model");

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Public
exports.getAllCoupons = handlersFactory.getAll(Coupon);

// @desc    Get coupon by ID
// @route   GET /api/v1/coupons/:id
// @access  Public
exports.getCoupon = handlersFactory.getOne(Coupon);

// @desc    create coupon
// @route   POST /api/v1/coupons
// @access  Private / Admin - Manager
exports.createCoupon = handlersFactory.createOne(Coupon);

// @desc    Update coupon by ID
// @route   PUT /api/v1/coupons/:id
// @access  Private / Admin - Manager
exports.updateCoupon = handlersFactory.updateOne(Coupon);

// @desc    Delete coupon by ID
// @route   DELETE /api/v1/coupons/:id
// @access  Private / Admin - Manager
exports.deleteCoupon = handlersFactory.deleteOne(Coupon);
