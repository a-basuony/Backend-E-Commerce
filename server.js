const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const connectDB = require("./config/db");
const categoryRouter = require("./routes/category.route");

const app = express();
dotenv.config(); // load first ✅

// Dev logging middleware
app.use(express.json());
const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${NODE_ENV}`);
}

// Mount routes

app.use("/api/v1/category", categoryRouter);

// 404 Error handling middleware
app.all("*", (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});
app.use((req, res, next) => {
  const error = new Error("API route not found");
  error.statusCode = 404;
  next(error); // for 500 middleware to handle it
});

// Global Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  console.error("🔥 Error:", err.message);

  res.status(statusCode).json({
    message: error.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} and Database connected`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error.message);
  });
