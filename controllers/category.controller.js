const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Category = require("../models/category.model");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc    Get all categories with pagination
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const documentsCounts = await Category.countDocuments();

  const features = new ApiFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .search("Categories")
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
exports.getCategory = factory.getOne(Category)

// @desc    Create new category
// @route   POST /api/categories
// // @access  Private
exports.createCategory = factory.createOne(Category);


// @desc    Update category by ID
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);
