const multer = require("multer");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

const Category = require("../models/category.model");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/categories");

    // if directory doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuid()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Not an image! Please upload only images", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoryImage = upload.single("image");

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
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);
