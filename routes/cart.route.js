const express = require("express");

const {
  addToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
} = require("../controllers/cart.controller");
const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router
  .route("/")
  .get(protected, allowTo("user"), getLoggedUserCart)
  .post(protected, allowTo("user"), addToCart)
  .delete(protected, allowTo("user"), clearCart);

router
  .route("/:itemId")
  .put(protected, allowTo("user"), removeSpecificCartItem);

module.exports = router;
