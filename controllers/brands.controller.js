const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brand.model");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(BrandModel);

// @desc    Get brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(BrandModel);

// @desc    create brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(BrandModel);

// @desc    Update brand by ID
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc    Delete brand by ID
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(BrandModel);
