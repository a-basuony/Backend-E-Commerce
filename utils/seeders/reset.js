const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

// Load env vars
dotenv.config();

// Connect DB
const connectDB = require("../../config/db");
const cleanDB = require("./cleanDB");

const reset = async () => {
  try {
    await connectDB();
    await cleanDB();
    process.exit();
  } catch (error) {
    console.error("Reset Failed:".red, error);
    process.exit(1);
  }
};

reset();
