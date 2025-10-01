const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../controllers/category.controller");

const {
  getCategoryValidators,
  updateCategoryValidators,
  deleteCategoryValidators,
  createCategoryValidators,
} = require("../utils/validators/categoryValidators");
const subCategoryRouter = require("./subcategory.route");

const router = express.Router();

// api/v1/categories/:categoryId/subcategories
router.use("/:categoryId/subcategories", subCategoryRouter);

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidators,
    createCategory
  );
// router.get("/", getCategories);
// router.post("/", createCategory);

router
  .route("/:id")
  .get(getCategoryValidators, getCategory)
  .put(updateCategoryValidators, updateCategory)
  .delete(deleteCategoryValidators, deleteCategory);

// router.get("/:id", getCategory);
// router.put("/:id", updateCategory);
// router.delete("/:id", deleteCategory);

module.exports = router;
