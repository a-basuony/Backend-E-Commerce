const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  setFilterObject,
  getSpecificOrder,
  updateOrderPaid,
  updateOrderDelivered,
  checkoutSession,
} = require("../controllers/order.controller");

const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();
router.use(protected);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/v1/orders/checkout-session/{cartId}:
 *   post:
 *     summary: Create checkout session
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Checkout session created
 */
router.route("/checkout-session/:cartId").get(allowTo("user"), checkoutSession);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of orders
 */
router
  .route("/")
  .get(allowTo("user", "admin", "manager"), setFilterObject, getAllOrders);

/**
 * @swagger
 * /api/v1/orders/{cartId}:
 *   post:
 *     summary: Create cash order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.route("/:cartId").post(allowTo("user"), createCashOrder);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get specific order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.route("/:id").get(allowTo("user", "admin", "manager"), getSpecificOrder);

/**
 * @swagger
 * /api/v1/orders/{id}/paid:
 *   put:
 *     summary: Update order to paid
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order updated to paid
 */
router.route("/:id/paid").put(allowTo("admin"), updateOrderPaid);

/**
 * @swagger
 * /api/v1/orders/{id}/delivered:
 *   put:
 *     summary: Update order to delivered
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order updated to delivered
 */
router.route("/:id/delivered").put(allowTo("admin"), updateOrderDelivered);

module.exports = router;
