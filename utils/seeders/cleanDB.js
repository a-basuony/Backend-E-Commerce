const mongoose = require("mongoose");
const colors = require("colors");

const cleanDB = async () => {
  try {
    console.log("Cleanup started...".cyan.inverse);

    if (!mongoose.connection.db) {
      throw new Error("Database not connected");
    }

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    for (const collection of collections) {
      // Skip system collections if any
      if (collection.name.startsWith("system.")) continue;

      await mongoose.connection.db.collection(collection.name).deleteMany({});
    }

    console.log("Database Cleared Successfully!".red.inverse);
  } catch (error) {
    console.error("Error clearing database:".red, error);
    process.exit(1);
  }
};

module.exports = cleanDB;
