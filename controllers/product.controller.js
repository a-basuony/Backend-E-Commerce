const Product = require("../models/product.model");

const factory = require("./handlersFactory");

// @desc Get all products
// @route GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product, "Product");

// @desc       Get product by ID
// @route      GET /api/v1/products/:id
// @access     Public
exports.getProduct = factory.getOne(Product);

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
