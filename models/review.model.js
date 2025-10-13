const mongoose = require("mongoose");
const Product = require("./product.model");

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

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // stage 1.  get all reviews for a product
    {
      // depending on productId , get all reviews for this product
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
    // stage 2.  group by product id and calculate average rating & quantity
    {
      $group: {
        _id: "$product",
        avgRatings: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  console.log(result);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

// ✅ Recalculate after save (create / update)
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
// // ✅ Recalculate after save (create / update)
// reviewSchema.post("remove", async function () {
//   await this.constructor.calcAverageRatingsAndQuantity(this.product);
// });

// ✅ Handle updates and deletes
reviewSchema.pre(/^findOneAnd/, async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  this.r = docToUpdate;
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // Run calc only if a document existed
  if (this.r) {
    await this.r.constructor.calcAverageRatingsAndQuantity(this.r.product);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
