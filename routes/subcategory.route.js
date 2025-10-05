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
const { protect, allowTo } = require("../controllers/auth.controller");
// mergeParams: true => /api/v1/categories/:categoryId/subcategories
// getSubCategories => /api/v1/categories/:categoryId/subcategories
// mergeParams: true => allow us to access the params of the parent route
// we need to access categoryId form category router
const router = express.Router({ mergeParams: true });

router.route("/").get(setFilterObject, getSubCategories).post(
  protect, // check token
  allowTo("admin", "manager"), // check role
  setCategoryIdToBody,
  createSubCategoryValidators,
  createSubCategory
);
router
  .route("/:id")
  .get(getSubCategoryValidators, getSubCategory)
  .put(
    protect, // check token
    allowTo("admin", "manager"), // check role
    updateSubCategoryValidators,
    updateSubCategory
  )
  .delete(
    protect, // check token
    allowTo("admin"), // check role
    deleteSubCategoryValidators,
    deleteSubCategory
  );

module.exports = router;
