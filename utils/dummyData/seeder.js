const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

const connectDB = require("../../config/db");

// Load env vars
dotenv.config();

// Load models
const Product = require("../../models/product.model");

// Connect to DB
connectDB();
// Read JSON files
const products = JSON.parse(fs.readFileSync(__dirname + "/products.json"));

// Import into DB
const importData = async () => {
  try {
    await Product.create(products);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Run commands
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

// node seeder.js -i insert data
// node seeder -d delete data
// node ./utils/dummyData/seeder.js -d
