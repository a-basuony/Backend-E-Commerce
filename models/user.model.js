const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please add a user name"],
      minlength: [3, "User name must be at least 3 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please add a user email"],
      lowercase: true,
      unique: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, "Please add a user password"],
      minlength: [6, "User password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
); // we can add favorites

module.exports = mongoose.model("User", userSchema);
