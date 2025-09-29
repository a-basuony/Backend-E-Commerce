const asyncHandler = require("express-async-handler");

const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");

// @desc       Get all products
// @route      GET /api/v1/products
// @access     Public

exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  const products = await Product.find({})
    .populate({ path: "category", select: "name -_id" })
    .skip((page - 1) * limit)
    .limit(limit);

  if (products.length === 0) {
    //we can't use `!products` here because ❌ Product.find({}) return an empty array if no products is found, not null.

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
