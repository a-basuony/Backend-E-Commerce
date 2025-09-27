const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const SubCategory = require("../models/subcategory.model");
const ApiError = require("../utils/apiError");

// @desc    Get all subCategories
// @route   GET /api/v1/subcategory
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }

  const subCategories = await SubCategory.find(filter)
    .populate({ path: "category", select: "name -_id" })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!subCategories || subCategories.length === 0) {
    return next(new ApiError("SubCategories not found", 404));
  }

  const total = await SubCategory.countDocuments();
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    message: "success",
    result: subCategories.length,
    page: page,
    data: subCategories,
    pagination: { total, page, limit, totalPages },
  });
});

// @desc    Get subCategory by ID
// @route   GET /api/v1/subcategory/:id
// @access  Public
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  if (!subCategory) {
    return next(new ApiError("Create failed : SubCategory not found", 404));
  }

  res.status(201).json({ message: "SubCategory created", data: subCategory });
});

//@desc    Get subCategory by ID
// @route   GET /api/v1/subcategory/:id
// @access  Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return next(new ApiError(`SubCategory not found for id: ${id}`, 404));
  }
  res.status(200).json({ message: "success", data: subCategory });
});

// @desc    Update subCategory by ID
// @route   PUT /api/v1/subcategory/:id
// @access  Public
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const { id } = req.params;

  const subCategory = await SubCategory.findById(id);

  if (!subCategory) {
    return next(
      new ApiError(`Update failed : SubCategory not found for id: ${id}`, 404)
    );
  }

  subCategory.name = name || subCategory.name;
  subCategory.category = category || subCategory.category;

  await subCategory.save();

  res.status(200).json({ message: "SubCategory updated", data: subCategory });
});

// @desc    Delete subCategory by ID
// @route   DELETE /api/v1/subcategory/:id
// @access  Public
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(
      new ApiError(`Delete failed : SubCategory not found for id: ${id}`, 404)
    );
  }

  res.status(200).json({ message: "SubCategory deleted", data: subCategory });
});
