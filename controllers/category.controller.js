const Category = require("../models/category.model");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { resizeImage } = require("../middlewares/resizeImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeCategoryImage = resizeImage("categories", "category");
// @desc    Get all categories with pagination
// @route   GET /api/categories
// @access  Public
exports.getCategories = factory.getAll(Category);

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create new category
// @route   POST /api/categories
// // @access  Private
exports.createCategory = factory.createOne(Category);

// @desc    Update category by ID
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category, {
  imageFolder: "categories",
});

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);
