const express = require("express");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../controllers/brands.controller");
const {
  createBrandValidators,
  getBrandValidators,
  updateBrandValidators,
  deleteBrandValidators,
} = require("../utils/validators/brandValidators");
const { protect, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router.route("/").get(getBrands).post(
  protect, // check token
  allowTo("admin", "manager"), // check role
  uploadBrandImage,
  resizeBrandImage,
  createBrandValidators,
  createBrand
);
router
  .route("/:id")
  .get(getBrandValidators, getBrand)
  .put(uploadBrandImage, resizeBrandImage, updateBrandValidators, updateBrand)
  .delete(
    protect, // check token
    allowTo("admin", "manager"), // check role
    deleteBrandValidators,
    deleteBrand
  );

module.exports = router;
