const SubCategory = require("../models/subcategory.model");
const factory = require("./handlersFactory");

exports.setFilterObject = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  req.filterObject = filter;
  next();
};

// @desc    Get all subCategories
// @route   GET /api/v1/subcategory
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory);

exports.setCategoryIdToBody = (req, res, next) => {
  if (req.params.categoryId) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// @desc    Get subCategory by ID
// @route   POST /api/v1/subcategories/
// @access  Private
exports.createSubCategory = factory.createOne(SubCategory);

//@desc    Get subCategory by ID
// @route   GET /api/v1/subcategory/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc    Update subCategory by ID
// @route   PUT /api/v1/subcategory/:id
// @access  Public
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete subCategory by ID
// @route   DELETE /api/v1/subcategory/:id
// @access  Public
exports.deleteSubCategory = factory.deleteOne(SubCategory);
