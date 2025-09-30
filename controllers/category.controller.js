const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Category = require("../models/category.model");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc    Get all categories with pagination
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const documentsCounts = await Category.countDocuments();

  const features = new ApiFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(documentsCounts); // pass total documents if you want

  const categories = await features.mongooseQuery; // keep your property name

  if (!categories) {
    return next(new ApiError("Categories not found", 404));
  }

  res.status(200).json({
    message: "success",
    count: categories.length,
    pagination: features.paginationResult,
    data: categories,
  });
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ message: "success", data: category });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, image } = req.body;
  const slug = slugify(name, { lower: true });

  const category = await Category.create({ name, slug, image });

  if (!category) {
    return next(new ApiError("Create failed : Category not found", 404));
  }

  res.status(201).json({ message: "Category created", data: category });
});

// @desc    Update category by ID
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new ApiError(
        `Update failed : Category not found for id: ${req.params.id}`,
        404
      )
    );
  }

  category.name = name || category.name;
  await category.save();

  res.status(200).json({ message: "Category updated", data: category });
});

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(
      new ApiError(
        `Delete failed : Category not found for id: ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ message: "Category deleted", data: category });
});
