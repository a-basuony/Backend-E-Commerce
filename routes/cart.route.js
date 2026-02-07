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

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 */

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get logged user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart
 *       404:
 *         description: Cart not found
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - color
 *             properties:
 *               productId:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to cart
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Clear logged user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Cart cleared successfully
 */
router.route("/").get(getLoggedUserCart).post(addToCart).delete(clearCart);

/**
 * @swagger
 * /api/v1/cart/applyCoupon:
 *   put:
 *     summary: Apply coupon to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - couponName
 *             properties:
 *               couponName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *       404:
 *         description: Coupon not found
 */
router.route("/applyCoupon").put(applyCoupon);

/**
 * @swagger
 * /api/v1/cart/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Cart or item not found
 *   delete:
 *     summary: Remove specific cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart Item ID
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Cart not found
 */
router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;
