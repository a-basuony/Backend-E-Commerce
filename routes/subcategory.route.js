const express = require("express");
const {
  getSubCategories,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setFilterObject,
  setCategoryIdToBody,
} = require("../controllers/subcategory.controller");
const {
  getSubCategoryValidators,
  updateSubCategoryValidators,
  deleteSubCategoryValidators,
  createSubCategoryValidators,
} = require("../utils/validators/subcategoryValidators");
// mergeParams: true => /api/v1/categories/:categoryId/subcategories
// getSubCategories => /api/v1/categories/:categoryId/subcategories
// mergeParams: true => allow us to access the params of the parent route
// we need to access categoryId form category router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(setFilterObject, getSubCategories)
  .post(setCategoryIdToBody, createSubCategoryValidators, createSubCategory);
router
  .route("/:id")
  .get(getSubCategoryValidators, getSubCategory)
  .put(updateSubCategoryValidators, updateSubCategory)
  .delete(deleteSubCategoryValidators, deleteSubCategory);

module.exports = router;
