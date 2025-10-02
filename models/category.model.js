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
      // required: [true, "Please add a category image"],
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

categorySchema.post("init", (document) => {
  if (document.image) {
    document.image = `${process.env.BASE_URL}/categories/${document.image}`;
  }
});
module.exports = mongoose.model("Category", categorySchema);
