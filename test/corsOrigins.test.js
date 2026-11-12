const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createAllowedOrigins, isAllowedOrigin } = require("../config/corsOrigins");
const vercelConfig = require("../vercel.json");

test("only known frontend and local origins are trusted by default", () => {
  const origins = createAllowedOrigins();
  assert.equal(isAllowedOrigin("http://localhost:5173", origins), true);
  assert.equal(isAllowedOrigin("https://happy-shop-frontend-xi.vercel.app", origins), true);
  assert.equal(isAllowedOrigin("https://e-commerce-full-stack-mern.vercel.app", origins), true);
});

test("unknown Vercel origins and lookalike domains are denied", () => {
  const origins = createAllowedOrigins();
  assert.equal(isAllowedOrigin("https://other.vercel.app", origins), false);
  assert.equal(isAllowedOrigin("https://happy-shop-frontend-xi.vercel.app.attacker.test", origins), false);
  assert.equal(isAllowedOrigin("https://untrusted.example", origins), false);
});

test("explicit preview/custom domains can be configured safely", () => {
  const origins = createAllowedOrigins(" https://preview-one.vercel.app, https://shop.example.com, ");
  assert.equal(isAllowedOrigin("https://preview-one.vercel.app", origins), true);
  assert.equal(isAllowedOrigin("https://shop.example.com", origins), true);
  assert.equal(isAllowedOrigin("https://other.vercel.app", origins), false);
});

test("non-browser requests without Origin remain allowed", () => {
  assert.equal(isAllowedOrigin(undefined, createAllowedOrigins()), true);
});

test("Vercel does not override the origin-specific Express CORS headers", () => {
  assert.ok(!vercelConfig.headers, "Vercel must not set a static Access-Control-Allow-Origin header");
});
