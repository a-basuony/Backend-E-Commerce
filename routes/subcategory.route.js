const express = require("express");
const { getSubCategories } = require("../controllers/subcategory.controller");

const router = express.Router();

router.route("/:categoryId").get(getSubCategories);

module.exports = router;
