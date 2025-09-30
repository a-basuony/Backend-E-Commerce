const asyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");

const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc Get all products
// @route GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const documentsCounts = await Product.countDocuments();

  const features = new ApiFeatures(
    Product.find().populate({ path: "category", select: "name -_id" }),
    req.query
  )
    .filter()
    .sort()
    .search("Products")
    .limitFields()
    .paginate(documentsCounts); // pass total documents if you want

  const products = await features.mongooseQuery; // keep your property name

  res.status(200).json({
    message: "success",
    count: products.length,
    pagination: features.paginationResult,
    data: products,
  });
});

// @desc       Get product by ID
// @route      GET /api/v1/products/:id
// @access     Public
exports.getProduct = factory.getOne(Product)

// @desc        Create Product
// @route       POST /api/v1/products
// @access      Private
exports.createProduct = factory.createOne(Product);

// @desc        Update Product by ID
// @route       PUT /api/v1/products/:id
// @access      Private
exports.updateProduct = factory.updateOne(Product);

// @desc        Delete Product by ID
// @route       DELETE /api/v1/products/:id
// @access      Private
exports.deleteProduct = factory.deleteOne(Product);
