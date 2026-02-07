const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setFilterObject,
  setProductIdAndUserIdToBody,
} = require("../controllers/review.controller");

const { protected, allowTo } = require("../controllers/auth.controller");
const {
  createReviewValidators,
  getReviewValidators,
  updateReviewValidators,
  deleteReviewValidators,
} = require("../utils/validators/reviewValidators");

// to enable nested routes
const router = express.Router({ mergeParams: true });
// api/v1/products/:productId/reviews
// from product route => router.use("/:productId/reviews", reviewRouter);

//set filter object to req to add filter to mongoose query

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
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
 *         description: List of reviews
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - rating
 *               - product
 *             properties:
 *               title:
 *                 type: string
 *               rating:
 *                 type: number
 *               product:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.route("/").get(setFilterObject, getReviews).post(
  protected, // check token
  allowTo("user"), // check role
  setProductIdAndUserIdToBody,
  createReviewValidators,
  createReview,
);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 *   put:
 *     summary: Update review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router
  .route("/:id")
  .get(getReviewValidators, getReview)
  .put(
    protected, // check token
    allowTo("user"), // update only user review
    updateReviewValidators,
    updateReview,
  )
  .delete(
    protected, // check token
    allowTo("user", "admin", "manager"), // check role
    deleteReviewValidators,
    deleteReview,
  );

module.exports = router;
