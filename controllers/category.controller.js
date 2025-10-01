const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");

const Category = require("../models/category.model");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuid()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`); // save image to uploads/categoriesfilename`);

  req.body.image = filename;
  next();
});

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
