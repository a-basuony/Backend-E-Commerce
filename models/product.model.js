const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a product title"],
      minlength: [3, "Product title must be at least 3 characters long"],
      maxlength: [100, "Product title must be less than 100 characters long"],
    },
    slug: {
      type: String,
      // required: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      required: [true, "Please add a product description"],
      minlength: [3, "Product description must be at least 3 characters long"],
      maxlength: [
        1000,
        "Product description must be less than 1000 characters long",
      ],
    },
    quantity: {
      type: Number,
      required: [true, "Please add a product quantity"],
      trim: true,
      min: [0, "Product quantity can't be less than 0"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please add a product price"],
      trim: true,
      max: [20000, "Product price must be less than 20000 "],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name _id",
  });
  next();
});

module.exports = mongoose.model("Product", productSchema);
