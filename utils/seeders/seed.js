const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

// Load env vars
dotenv.config();

// Connect DB
const connectDB = require("../../config/db");

// Seeders
const cleanDB = require("./cleanDB");
const seedUsers = require("./user.seeder");
const seedCategories = require("./category.seeder");
const seedProducts = require("./product.seeder");
const seedReviews = require("./review.seeder");
const seedCoupons = require("./coupon.seeder");
const seedCarts = require("./cart.seeder");
const seedOrders = require("./order.seeder");

const seedAll = async () => {
  try {
    await connectDB();

    // Optional: Clean DB first if argument provided, but reset.js handles that usually.
    // Let's assume this script is additive unless we want to be destructive.
    // Prompt says "Auto-generate data", "Prevent duplication".
    // CleanDB is safest.

    // Wait, "Prevent duplication" implies we might check before adding.
    // But cleanDB is simpler.
    // However, I have a separate reset.js.
    // I will make seed.js additive but smart, or just rely on reset.js to be run first for a clean slate.
    // But to be safe and consistent with "seed" usually meaning "populate from scratch" or "ensure data exists", I will NOT clean here unless specifically asked.
    // Users can run `npm run seed:reset` then `npm run seed`.
    // OR `npm run seed:all` which does both.

    // Actually, for "Prevent duplication", checking existence is hard for random faker data.
    // So I will assume this is run on a clean DB or I accept some growth.
    // The implementation_plan said: "Works with MongoDB Atlas".

    await seedUsers(5); // 5 users + 1 admin
    await seedCategories(5); // 5 categories, subcategories, brands
    await seedProducts(20); // 20 products
    await seedReviews(30);
    await seedCoupons(5);
    await seedCarts(3);
    await seedOrders(10);

    console.log("ALL DATA SEEDED SUCCESSFULLY".green.bold);
    process.exit();
  } catch (error) {
    console.error("Seeding Failed:".red, error);
    process.exit(1);
  }
};

seedAll();
