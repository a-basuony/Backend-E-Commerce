const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brand.model");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

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
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`Brand not found for id: ${id}`, 404));
  }

  res.status(200).json({ message: "success", data: brand });
});

// @desc    create brand
// @route   POST /api/v1/brands
// @access  Public
exports.createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const brand = await BrandModel.create({
    name,
    slug: slugify(name),
    image: "no-image.jpg",
  });
  if (!brand) {
    return next(new ApiError("Create failed : Brand not found", 404));
  }

  res.status(201).json({ message: "Brand created", data: brand });
});

// @desc    Update brand by ID
// @route   PUT /api/v1/brands/:id
// @access  Public
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(
      new ApiError(`Update failed : Brand not found for id: ${id}`, 404)
    );
  }

  brand.name = name || brand.name;
  brand.slug = slugify(brand.name);
  const updatedBrand = await brand.save();
  res.status(200).json({ message: "Brand updated", data: updatedBrand });
});

// @desc    Delete brand by ID
// @route   DELETE /api/v1/brands/:id
// @access  Public
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(
      new ApiError(`Delete failed : Brand not found for id: ${id}`, 404)
    );
  }

  res.status(200).json({ message: "Brand deleted", data: brand });
});
