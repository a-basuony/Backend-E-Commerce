const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const { protected, allowTo } = require("../controllers/auth.controller");
const {
  createReviewValidators,
  getReviewValidators,
  updateReviewValidators,
  deleteReviewValidators,
} = require("../utils/validators/reviewValidators");

const router = express.Router();

router.route("/").get(getReviews).post(
  protected, // check token
  allowTo("user"), // check role
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
