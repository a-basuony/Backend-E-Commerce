const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const connectDB = require("./config/db");
const categoryRouter = require("./routes/category.route");
const ApiError = require("./utils/apiError");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

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

// Not Found middleware
app.use(notFound);
// Global Error handling middleware
app.use(errorHandler);

// Start server
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
