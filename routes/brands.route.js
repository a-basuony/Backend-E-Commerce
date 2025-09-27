const express = require("express");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brands.controller");
const {
  createBrandValidators,
  getBrandValidators,
  updateBrandValidators,
  deleteBrandValidators,
} = require("../utils/validators/brandValidators");

const router = express.Router();

router.route("/").get(getBrands).post(createBrandValidators, createBrand);
router
  .route("/:id")
  .get(getBrandValidators, getBrand)
  .put(updateBrandValidators, updateBrand)
  .delete(deleteBrandValidators, deleteBrand);

module.exports = router;
