const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const {
  getCategoryValidations,
} = require("../utils/validators/categoryValidators");

const router = express.Router();
router.route("/").get(getCategories).post(createCategory);
// router.get("/", getCategories);
// router.post("/", createCategory);

router
  .route("/:id")
  .get(getCategoryValidations, getCategory)
  .put(updateCategory)
  .delete(deleteCategory);
// router.get("/:id", getCategory);
// router.put("/:id", updateCategory);
// router.delete("/:id", deleteCategory);

module.exports = router;
