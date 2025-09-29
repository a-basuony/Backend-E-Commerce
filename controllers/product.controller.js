const asyncHandler = require("express-async-handler");

const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");

// @desc       Get all products
// @route      GET /api/v1/products
// @access     Public

exports.getProducts = asyncHandler(async (req, res, next) => {
  // 1=> 1. filtering
  const queryObj = { ...req.query };
  console.log(queryObj);
  // 2. Remove special fields (not used in filtering)
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 3. Advanced filtering (gte, lte, gt, lt)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filters = JSON.parse(queryStr);

  console.log("Filters:", queryStr);

  // 2=> pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  //Build query
  const mongooseQuery = Product.find(filters)
    .populate({ path: "category", select: "name -_id" })
    .skip(skip)
    .limit(limit);

  // 3=> sorting
  if (req.query.sort) {
    // sorting from smallest to biggest (ascending) ?sort=price
    // sorting from biggest to smallest (descending) ?sort=-price
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery.sort(sortBy);
  }
  // execute query
  // to chain more of methods
  const products = await mongooseQuery;

  if (products.length === 0) {
    return next(new ApiError("Products not found", 404));
  }
  const total = await Product.countDocuments();
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
