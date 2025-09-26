const express = require("express");
const {
  getSubCategories,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subcategory.controller");
const {
  getSubCategoryValidators,
  updateSubCategoryValidators,
  deleteSubCategoryValidators,
  createSubCategoryValidators,
} = require("../utils/validators/subcategoryValidators");

const router = express.Router();

router
  .route("/")
  .get(getSubCategories)
  .post(createSubCategoryValidators, createSubCategory);
router
  .route("/:id")
  .get(getSubCategoryValidators, getSubCategory)
  .put(updateSubCategoryValidators, updateSubCategory)
  .delete(deleteSubCategoryValidators, deleteSubCategory);

module.exports = router;
