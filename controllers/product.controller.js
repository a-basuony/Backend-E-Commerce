const asyncHandler = require("express-async-handler");

const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");

// @desc       Get all products
// @route      GET /api/v1/products
// @access     Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // 1=> filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filters = JSON.parse(queryStr);

  // 5 => search
  if (req.query.keyword) {
    const keyword = req.query.keyword;
    filters.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  // 2=> pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  // Build query
  let mongooseQuery = Product.find(filters)
    .populate({ path: "category", select: "name -_id" })
    .skip(skip)
    .limit(limit);

  // 3=> sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // 4=> field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // execute query
  const products = await mongooseQuery;

  // ⚠️ الأفضل: رجع Array فاضية بدل Error
  if (!products || products.length === 0) {
    return res.status(200).json({
      message: "success",
      count: 0,
      data: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
    });
  }

  const total = await Product.countDocuments(filters);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    message: "success",
    count: products.length,
    data: products,
    pagination: { total, page, limit, totalPages },
  });
});

// @desc       Get product by ID
// @route      GET /api/v1/products/:id
// @access     Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError(`Product not found for id: ${id}`, 404));
  }

  res.status(200).json({
    message: "success",
    data: product,
  });
});

// @desc        Create Product
// @route       POST /api/v1/products
// @access      Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  if (!product) {
    return next(new ApiError("Create failed : Product not found", 404));
  }

  res.status(201).json({
    message: "Product created",
    data: product,
  });
});

// @desc        Update Product by ID
// @route       PUT /api/v1/products/:id
// @access      Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

  if (!product) {
    return next(
      new ApiError(`Update failed : Product not found for id: ${id}`, 404)
    );
  }

  res.status(200).json({
    message: "Product updated",
    data: product,
  });
});

// @desc        Delete Product by ID
// @route       DELETE /api/v1/products/:id
// @access      Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(
      new ApiError(`Delete failed : Product not found for id: ${id}`, 404)
    );
  }

  res.status(200).json({
    message: "Product deleted",
    data: product,
  });
});
