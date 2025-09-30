const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brand.model");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res, next) => {
  const documentsCounts = await BrandModel.countDocuments();

  const features = new ApiFeatures(BrandModel.find(), req.query)
    .filter()
    .sort()
    .search("Brands")
    .limitFields()
    .paginate(documentsCounts); // pass total documents if you want

  const brands = await features.mongooseQuery; // keep your property name

  if (!brands) {
    return next(new ApiError("Brands not found", 404));
  }

  res.status(200).json({
    message: "success",
    count: brands.length,
    pagination: features.paginationResult,
    data: brands,
  });
});

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
