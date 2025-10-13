const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const connectDB = require("./config/db");
const categoryRouter = require("./routes/category.route");
const subcategoryRouter = require("./routes/subcategory.route");
const brandsRouter = require("./routes/brands.route");
const productRouter = require("./routes/product.route");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const ReviewRouter = require("./routes/review.route");
const wishListRouter = require("./routes/wishList.route");
const addressRouter = require("./routes/address.route");
const couponRouter = require("./routes/coupon.route");

const { notFound, globalError } = require("./middlewares/errorMiddleware");

dotenv.config(); // Load env vars first ✅

const app = express();

// Middleware
app.use(express.json());
const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${NODE_ENV}`);
}

// http://localhost:8000/uploads/categories/imageName.jpeg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
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

// Not Found middleware
app.use(notFound);
// Global Error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;

let server; // 🔑 keep reference for process.on handlers

// Connect DB and start server
connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} and Database connected`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error.message);
    process.exit(1); // fail fast if DB not connected
  });

// 🔥 Handle uncaught exceptions (synchronous errors)
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

// 🔥 Handle unhandled promise rejections (async errors)
// handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`💥 Unhandled Rejection: ${err.name}| ${err.message}`, err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
