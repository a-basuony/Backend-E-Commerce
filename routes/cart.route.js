const express = require("express");

const { addToCart } = require("../controllers/cart.controller");
const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router.route("/").post(protected, allowTo("user"), addToCart);

module.exports = router;
