const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const SubCategory = require("../models/subcategory.model");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
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
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const documentsCounts = await SubCategory.countDocuments();

  const features = new ApiFeatures(SubCategory.find(), req.query)
    .filter()
    .sort()
    .search("SubCategories")
    .limitFields()
    .paginate(documentsCounts); // pass total documents if you want

  const subCategories = await features.mongooseQuery; // keep your property name

  if (!subCategories || subCategories.length === 0) {
    return next(new ApiError("SubCategories not found", 404));
  }

  res.status(200).json({
    message: "success",
    pagination: features.paginationResult,
    count: subCategories.length,
    data: subCategories,
  });
});

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
