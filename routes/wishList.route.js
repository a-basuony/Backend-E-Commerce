const express = require("express");
const {
  addProductToWishList,
  removeProductFromWishList,
  getLoggedUserWishList,
} = require("../controllers/wishList.controller");

const { protected, allowTo } = require("../controllers/auth.controller");
const {
  addProductToWishListValidator,
  removeProductFromWishListValidator,
} = require("../utils/validators/wishListValidators");

const router = express.Router();

router.use(protected, allowTo("user"));

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management
 */

/**
 * @swagger
 * /api/v1/wishlist:
 *   get:
 *     summary: Get logged user wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User wishlist
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       400:
 *         description: Validation error
 */
router
  .route("/")
  .get(getLoggedUserWishList)
  .post(addProductToWishListValidator, addProductToWishList);

/**
 * @swagger
 * /api/v1/wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       404:
 *         description: Product not found in wishlist
 */
router
  .route("/:productId")
  .delete(removeProductFromWishListValidator, removeProductFromWishList);
module.exports = router;
