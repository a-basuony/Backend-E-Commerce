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
const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

// api/v1/categories/:categoryId/subcategories
router.use("/:categoryId/subcategories", subCategoryRouter);

router.route("/").get(getCategories).post(
  protected, // check token
  allowTo("admin", "manager"), // check role
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
  .put(
    protected, // check token
    allowTo("admin", "manager"), // check role
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidators,
    updateCategory
  )
  .delete(
    protected, // check token
    allowTo("admin"), // check role
    deleteCategoryValidators,
    deleteCategory
  );

// router.get("/:id", getCategory);
// router.put("/:id", updateCategory);
// router.delete("/:id", deleteCategory);

module.exports = router;
