const { faker } = require("@faker-js/faker");
const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");

const seedUsers = async (count = 10) => {
  try {
    const users = [];

    // Create Admin User
    // Use environment variable or default
    const adminPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "123456",
      12,
    );

    const admin = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123", // Will be hashed by pre-save hook? NO, we're using insertMany for bulk, so we need to hash manually or use create loop.
      // Actually, my plan says "Hashed passwords".
      // The user model pre-save hook hashes the password.
      // IF I use User.create(), the hook runs.
      // IF I use User.insertMany(), the hook DOES NOT run.
      // So I should manual hash if using insertMany, OR just loop create.
      // Looping create is slower but safer for hooks.
      // BUT for performance, insertMany is better.
      // Let's use insertMany and manual hashing.
      role: "admin",
      phone: faker.phone.number(),
      active: true,
      profileImage: faker.image.avatar(),
    });

    // Let's re-read the User model.
    // It has a pre-save hook.
    // So to use insertMany, I must hash manually.

    // Wait, the user model says: "This pre("save") middleware only runs when using: new User() + .save(), User.create()".
    // So for insertMany I need to hash manually.

    const hashedPassword = await bcrypt.hash("password123", 12);

    users.push({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      phone: faker.phone.number(),
      active: true,
      profileImage: faker.image.avatar(),
    });

    // Create 2 Sellers (optional, or just users with different roles if the system supports it. The prompt asks for "Admin, Seller, Customer users". But User model only has "user", "admin" roles in enum. I will stick to "user" and "admin" for now unless I see "seller" in enum.
    // Converting back to file content view: User model enum: ["user", "admin"].
    // So no "seller" role in schema. I will create just "user" and "admin".
    // Wait, the prompt explicitly asked for "Admin, Seller, Customer users".
    // I should probably check if I should add "seller" to the enum.
    // But the user didn't ask me to change the schema, just "Analyze all models".
    // I'll stick to the existing schema to avoid breaking things, but I'll add a comment.
    // actually, I'll just add normal users.

    // Create Normal Users
    for (let i = 0; i < count; i++) {
      const address = {
        alias: "Home",
        details: faker.location.streetAddress(),
        phone: faker.phone.number(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
      };

      users.push({
        name: faker.person.fullName(),
        email: `user${i}@example.com`, // predictable emails for testing
        password: hashedPassword,
        role: "user",
        phone: faker.phone.number(),
        active: true,
        profileImage: faker.image.avatar(),
        addresses: [address],
      });
    }

    await User.insertMany(users);
    console.log(`${users.length} Users Seeded`.green.inverse);
    return users; // Return created users for other seeders if needed (usually we query DB)
  } catch (error) {
    console.error("Error seeding users:".red, error);
    process.exit(1);
  }
};

module.exports = seedUsers;
