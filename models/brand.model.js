const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a brand name"],
      unique: [true, "Brand name already exists"],
      minLength: [3, "Brand name must be at lease 3 characters long"],
      maxLength: [30, "Brand name must be less that 30 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      default: "no-image.jpg",
    },
  },
  { timestamps: true }
);

brandSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Brand", brandSchema);
