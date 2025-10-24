const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

dotenv.config(); // Load env vars first ✅

const connectDB = require("./config/db");
const mountRoutes = require("./routes");
const { notFound, globalError } = require("./middlewares/errorMiddleware");
const { webhookCheckout } = require("./controllers/order.controller");

const app = express();

// ---------------------------------------------
// 🌍 Core Middlewares
// ---------------------------------------------
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" })); // parse incoming JSON with a limit of 10kb
// ---------------------------------------------
// 🧱 Security Middlewares
// ---------------------------------------------

// Helmet → adds security headers
app.use(helmet());

// Express Mongo Sanitize → prevent NoSQL injection
app.use(mongoSanitize());
app.use(xss());

// HPP → prevent HTTP parameter pollution like: sort=price&sort=name
app.use(
  hpp({
    whitelist: [
      "category",
      "brand",
      "price",
      "ratingsAverage",
      "color",
      "size",
    ],
  })
);

// Rate Limiter → limit repeated requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max requests per IP
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// ---------------------------------------------
// 🧩 CSRF Protection
// ---------------------------------------------
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

// 🧩 CSRF Protection (skip webhook)
// app.use((req, res, next) => {
//   if (req.originalUrl === "/webhook-checkout") return next();
//   // csrfProtection(req, res, next);
// });

// ✅ Add CSRF Token route here
app.get("/api/v1/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ---------------------------------------------
// ⚙️ Webhook (Stripe)
// ---------------------------------------------
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// ---------------------------------------------
// 🛠 Development Logger
// ---------------------------------------------
const NODE_ENV = process.env.NODE_ENV || "development";
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${NODE_ENV}`);
}

// ---------------------------------------------
// 📁 Static Files
// ---------------------------------------------
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ---------------------------------------------
// 🧠 Routes
// ---------------------------------------------
app.get("/", (req, res) => res.send("✅ API is running"));
mountRoutes(app);

// ---------------------------------------------
// ❌ Not Found + Global Error
// ---------------------------------------------
app.use(notFound);
app.use(globalError);

// ---------------------------------------------
// 🚀 Server + Database
// ---------------------------------------------
const PORT = process.env.PORT || 8000;
let server;

connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} and Database connected`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  });

// ---------------------------------------------
// 🔥 Process Handlers
// ---------------------------------------------
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(`💥 Unhandled Rejection: ${err.name} | ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// ---------------------------------------------
// ✅ Export for Vercel
// ---------------------------------------------
module.exports = app;
