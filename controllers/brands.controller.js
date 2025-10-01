const { resizeImage } = require("../middlewares/resizeImageMiddleware");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../models/brand.model");
const factory = require("./handlersFactory");

exports.uploadBrandImage = uploadSingleImage("image");
exports.resizeBrandImage = resizeImage("brands", "brand");
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
exports.updateBrand = factory.updateOne(BrandModel, {
  imageFolder: "brands",
});

// @desc    Delete brand by ID
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(BrandModel);
