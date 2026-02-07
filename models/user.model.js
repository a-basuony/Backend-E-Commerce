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
    // passwordChangedAt: Date,
    // passwordResetToken: String,
    // passwordResetExpires: Date,
    // passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child reference one to many
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true },
); // we can add favorites

const setImageURL = (document) => {
  if (document.profileImage) {
    let baseUrl = process.env.BASE_URL;
    if (!baseUrl || baseUrl === "undefined" || baseUrl === "null") {
      baseUrl = "http://localhost:8000";
    }
    const imageUrl = `${baseUrl}/uploads/users/${document.profileImage}`;
    if (!document.profileImage.startsWith("http")) {
      document.profileImage = imageUrl;
    }
  }
};

userSchema.post("init", (document) => {
  // after run on find, findOne, findOneAndUpdate, findOneAndDelete
  setImageURL(document);
});
userSchema.post("save", (document) => {
  // after run on save or create a document which is creating a new document
  setImageURL(document);
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  console.log("🔥 Hashing password before save..."); // debug
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);

// This pre("save") middleware only runs when using:

// new User() + .save()

// User.create()

// ❌ It does NOT run when you use:

// User.findByIdAndUpdate()

// User.updateOne()
