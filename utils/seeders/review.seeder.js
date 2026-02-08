const { faker } = require("@faker-js/faker");
const Review = require("../../models/review.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");

const seedReviews = async (count = 50) => {
  try {
    const products = await Product.find({}, "_id");
    const users = await User.find({ role: "user" }, "_id"); // Only normal users leave reviews? Or admins too. Let's stick to users.

    if (products.length === 0 || users.length === 0) {
      console.log(
        "No products or users found. Skipping review seeding.".yellow,
      );
      return;
    }

    const reviews = [];

    for (let i = 0; i < count; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const user = users[Math.floor(Math.random() * users.length)];

      // avoid duplicate review for same product by same user
      const existingReview = reviews.find(
        (r) =>
          r.product.toString() === product._id.toString() &&
          r.user.toString() === user._id.toString(),
      );
      if (existingReview) continue;

      reviews.push({
        title: faker.lorem.sentence(),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        user: user._id,
        product: product._id,
      });
    }

    // Insert manually? Review model has post-save hooks to calculate average rating.
    // InsertMany does not trigger save middleware.
    // So we must loop and create.

    for (const reviewData of reviews) {
      await Review.create(reviewData);
    }

    console.log(`${reviews.length} Reviews Seeded`.green.inverse);
  } catch (error) {
    console.error("Error seeding reviews:".red, error);
    // process.exit(1);
    // Don't exit process here, just log error, maybe continue?
    // But failures are bad. Let's exit to be safe.
    process.exit(1);
  }
};

module.exports = seedReviews;
