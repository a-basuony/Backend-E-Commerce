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
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// ---------------------------------------------
// 🌍 Core Middlewares
// ---------------------------------------------
// أضف هذا الـ Middleware قبل الـ Routes مباشرة
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://happy-shop-frontend-xi.vercel.app",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  // مهم جداً للرد على طلب الـ Preflight بـ 200 OK
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
// 1. Trust Proxy - ضروري جداً لعمل الكوكيز على Vercel
app.set("trust proxy", 1);

// 2. Dynamic CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://happy-shop-frontend-xi.vercel.app",
  "https://e-commerce-full-stack-mern.vercel.app",
].filter(Boolean);
const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Origin", // ضروري جداً
  ],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" })); // parse incoming JSON with a limit of 10kb
// ---------------------------------------------
// 🧱 Security Middlewares
// ---------------------------------------------

// Helmet → adds security headers
// app.use(helmet());
// app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Express Mongo Sanitize → prevent NoSQL injection
// app.use(mongoSanitize());
// app.use(xss());

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
  }),
);

//On Vercel, your API is behind a proxy, so Express sees a forwarded IP header but doesn’t trust it.
app.set("trust proxy", 1); // ✅ Trust first proxy (Vercel / Cloudflare)

// Rate Limiter → limit repeated requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000, // max requests per IP
  message: "Too many requests, please try again later.",
  skip: (req) => req.method === "OPTIONS", // ✅ Skip preflight requests
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
  webhookCheckout,
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
// ---------------------------------------------
// 📁 Static Files
// ---------------------------------------------
// Always serve uploads to ensure local legacy images work even if in 'production' mode locally
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ---------------------------------------------
// 🧠 Routes
// ---------------------------------------------
app.get("/", (req, res) => res.send("✅ API is running"));

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.min.js",
    ],
  }),
);
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
      console.log(
        `ℹ️  Base URL: ${process.env.BASE_URL || "Not set (Using localhost)"}`,
      );
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
