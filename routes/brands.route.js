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

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeBrandImage, createBrandValidators, createBrand);
router
  .route("/:id")
  .get(getBrandValidators, getBrand)
  .put(uploadBrandImage, resizeBrandImage, updateBrandValidators, updateBrand)
  .delete(deleteBrandValidators, deleteBrand);

module.exports = router;
