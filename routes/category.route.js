const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
