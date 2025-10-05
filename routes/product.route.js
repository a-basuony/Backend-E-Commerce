const express = require("express");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeProductImages,
} = require("../controllers/product.controller");
const {
  createProductValidators,
  getProductValidators,
  updateProductValidators,
  deleteProductValidators,
} = require("../utils/validators/productValidator");
const { protect, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router.route("/").get(getProducts).post(
  protect, // check token
  allowTo("admin", "manager"), // check role
  uploadProductImage,
  resizeProductImages,
  createProductValidators,
  createProduct
);

router
  .route("/:id")
  .get(getProductValidators, getProduct)
  .put(
    protect, // check token
    allowTo("admin", "manager"), // check role
    uploadProductImage,
    resizeProductImages,
    updateProductValidators,
    updateProduct
  )
  .delete(
    protect, // check token
    allowTo("admin"), // check role
    deleteProductValidators,
    deleteProduct
  );

module.exports = router;
