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

router.route("/").get(setFilterObject, getReviews).post(
  protected, // check token
  allowTo("user"), // check role
  setProductIdAndUserIdToBody,
  createReviewValidators,
  createReview
);
router
  .route("/:id")
  .get(getReviewValidators, getReview)
  .put(
    protected, // check token
    allowTo("user"), // update only user review
    updateReviewValidators,
    updateReview
  )
  .delete(
    protected, // check token
    allowTo("user", "admin", "manager"), // check role
    deleteReviewValidators,
    deleteReview
  );

module.exports = router;
