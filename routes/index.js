const categoryRouter = require("./category.route");
const subcategoryRouter = require("./subcategory.route");
const brandsRouter = require("./brands.route");
const productRouter = require("./product.route");
const userRouter = require("./user.route");
const authRouter = require("./auth.route");
const ReviewRouter = require("./review.route");
const wishListRouter = require("./wishList.route");
const addressRouter = require("./address.route");
const couponRouter = require("./coupon.route");
const cartRouter = require("./cart.route");
const orderRouter = require("./order.route");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subcategoryRouter);
  app.use("/api/v1/brands", brandsRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", ReviewRouter);
  app.use("/api/v1/wishlist", wishListRouter);
  app.use("/api/v1/addresses", addressRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/orders", orderRouter);
};

module.exports = mountRoutes;
