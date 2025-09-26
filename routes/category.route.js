const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const {
  getCategoryValidators,
  updateCategoryValidators,
  deleteCategoryValidators,
  createCategoryValidators,
} = require("../utils/validators/categoryValidators");

const router = express.Router();
router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidators, createCategory);
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
