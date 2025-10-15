const express = require("express");

const {
  addToCart,
  getLoggedUserCart,
} = require("../controllers/cart.controller");
const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router
  .route("/")
  .get(protected, allowTo("user"), getLoggedUserCart)
  .post(protected, allowTo("user"), addToCart);

module.exports = router;
