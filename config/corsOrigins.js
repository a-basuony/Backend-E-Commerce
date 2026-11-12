const DEFAULT_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://happy-shop-frontend-xi.vercel.app",
  "https://e-commerce-full-stack-mern.vercel.app",
];

function createAllowedOrigins(configuredOrigins = "") {
  const origins = new Set(DEFAULT_ORIGINS);
  for (const candidate of configuredOrigins.split(",")) {
    const origin = candidate.trim();
    if (origin) origins.add(origin);
  }
  return origins;
}

function isAllowedOrigin(origin, allowedOrigins) {
  // Requests without an Origin header are not subject to browser CORS.
  return !origin || allowedOrigins.has(origin);
}

module.exports = { createAllowedOrigins, isAllowedOrigin };
