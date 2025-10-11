const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [3, "Review title must be at least 3 characters long"],
      maxLength: [100, "Review title must be less than 100 characters long"],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at lease 1"],
      max: [5, "Rating must be below 5"],
      required: [true, "Review must have a rating"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
