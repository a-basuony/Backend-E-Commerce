const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");

dotenv.config();

const connectDB = require("./config/db");
const mountRoutes = require("./routes");
const { notFound, globalError } = require("./middlewares/errorMiddleware");
const { webhookCheckout } = require("./controllers/order.controller");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// ---------------------------------------------
// 🌍 Core Middlewares & CORS Configuration
// ---------------------------------------------
// 1. Trust Proxy
app.set("trust proxy", 1);

// 2. CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://happy-shop-frontend-xi.vercel.app",
  "https://e-commerce-full-stack-mern.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Requested-With", "Accept", "Origin"]
}));

// حذف سطر app.options المتكرر الذي يسبب الـ Crash
app.options("*", cors());
app.use(compression());
app.use(cookieParser());

// ⚙️ Webhook Stripe (يجب أن يكون قبل express.json)
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json({ limit: "10kb" }));

// ---------------------------------------------
// 🧱 Security & Rate Limiting
// ---------------------------------------------

app.use(
  hpp({
    whitelist: ["category", "brand", "price", "ratingsAverage", "color", "size"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, 
  skip: (req) => req.method === "OPTIONS",
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

// ---------------------------------------------
// 🧠 Routes
// ---------------------------------------------

app.get("/", (req, res) => res.send("✅ API is running"));

app.get("/api/v1/csrf-token", (req, res) => {
  res.json({ message: "CSRF endpoint ready" });
});

// Swagger Setup
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.min.js",
    ],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

mountRoutes(app);

// ❌ Error Handling
app.use(notFound);
app.use(globalError);

// ---------------------------------------------
// 🚀 Server + Database
// ---------------------------------------------
const PORT = process.env.PORT || 8000;
let server;

connectDB(); 

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
// connectDB()
//   .then(() => {
//     server = app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("❌ DB connection error:", error.message);
//     process.exit(1);
//   });

// process.on("unhandledRejection", (err) => {
//   console.error(`💥 Unhandled Rejection: ${err.message}`);
//   if (server) server.close(() => process.exit(1));
// });

module.exports = app;