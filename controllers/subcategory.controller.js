const expressAsyncHandler = require("express-async-handler");
const SubCategory = require("../models/subcategory.model");
const ApiError = require("../utils/apiError");

// @desc    Get all subCategories
// @route   GET /api/v1/subcategory
// @access  Public
exports.getSubCategories = expressAsyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const subCategories = await SubCategory.find()
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
    data: subCategories,
    pagination: { total, page, limit, totalPages },
  });
});
