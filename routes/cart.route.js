const express = require("express");

const {
  addToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../controllers/cart.controller");
const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();
router.use(protected, allowTo("user"));

router.route("/").get(getLoggedUserCart).post(addToCart).delete(clearCart);

router.route("/applyCoupon").put(applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .put(removeSpecificCartItem);

module.exports = router;
