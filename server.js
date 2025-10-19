const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

dotenv.config(); // Load env vars first ✅

const connectDB = require("./config/db");
const mountRoutes = require("./routes");

const { notFound, globalError } = require("./middlewares/errorMiddleware");

const app = express();
// to enable other domains to access our API
app.use(cors());
// to compress responses to speed up requests
app.use(compression());
// Use helmet middleware
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

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
mountRoutes(app);
app.get("/", (req, res) => res.send("✅ API is running"));

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

// --------------------- EXPORT FOR VERCEL ---------------------
// ✅ Vercel needs this export instead of app.listen()
module.exports = app;
