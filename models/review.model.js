const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [3, "Review title must be at least 3 characters long"],
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

// ✅ Pre middleware to auto-populate user name & image
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name ", // only bring these fields
  }).populate({
    path: "product",
    select: "title -category", // 👈 or 'name imageCover' depending on your product schema
  });
  next();
});

// // ✅ 2. Auto populate after creating (save)
// reviewSchema.post("save", async (doc, next) => {
//   await doc.populate([
//     { path: "user", select: "name profileImg" },
//     { path: "product", select: "title imageCover" },
//   ]);
//   next();
// });

module.exports = mongoose.model("Review", reviewSchema);
