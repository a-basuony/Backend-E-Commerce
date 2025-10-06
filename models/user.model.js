const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
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

const setImageURL = (document) => {
  if (document.profileImage) {
    document.profileImage = `${process.env.BASE_URL}/uploads/users/${document.profileImage}`;
  }
};

userSchema.post("init", (document) => {
  setImageURL(document);
});
userSchema.post("save", (document) => {
  setImageURL(document);
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);
