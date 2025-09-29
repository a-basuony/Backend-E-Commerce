const express = require("express");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const {
  createProductValidators,
  getProductValidators,
  updateProductValidators,
  deleteProductValidators,
} = require("../utils/validators/productValidator");

const router = express.Router();

router.route("/").get(getProducts).post(createProductValidators, createProduct);

router
  .route("/:id")
  .get(getProductValidators, getProduct)
  .put(updateProductValidators, updateProduct)
  .delete(deleteProductValidators, deleteProduct);

module.exports = router;
