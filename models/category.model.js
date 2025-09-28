const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      unique: [true, "Category name already exists"],
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [30, "Category name must be less than 50 characters long"],
    },
    slug: {
      // replace spaces with hyphens
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      default: "no-image.jpg",
    },
  },
  { timestamps: true } // createdAt and updatedAt
);

categorySchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);

// use asyncHandler to avoid try/catch block
// ------------------
// details of validations , roles  => get from system analysis document from your company
///------------------
// 1. .then() and .catch()
// 2. async/await
// 3. try/catch
// 4. asyncHandler(async (req, res) => {}) package ==> express error handler {error from express}
// 5. try/catch + asyncHandler(async (req, res) => {})
//---------------
//@desc Get all categories
//@route GET /api/categories
// @access Public
// ---------------------

// minlength & maxlength for string
// min & max for number
