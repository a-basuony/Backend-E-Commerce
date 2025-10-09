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
const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router.route("/").get(getProducts).post(
  protected, // check token
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
    protected, // check token
    allowTo("admin", "manager"), // check role
    uploadProductImage,
    resizeProductImages,
    updateProductValidators,
    updateProduct
  )
  .delete(
    protected, // check token
    allowTo("admin"), // check role
    deleteProductValidators,
    deleteProduct
  );

module.exports = router;
