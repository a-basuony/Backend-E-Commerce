const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load env vars first ✅

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`,
    );
  } catch (error) {
    console.log(`❌ MongoDB Error: ${error.message}`);

    // Exit process (fail fast) — prevents app from running without DB
    process.exit(1);
  }
};

module.exports = connectDB;
