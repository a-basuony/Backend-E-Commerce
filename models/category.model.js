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
    // image: {
    //   type: String,
    //   // required: [true, "Please add a category image"],
    // },
    image: {
      url: { type: String },
      public_id: { type: String },
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

const setImageURL = (doc) => {
  if (doc.image && process.env.NODE_ENV === "development") {
    doc.image = `${process.env.BASE_URL}/uploads/categories/${doc.image}`;
  }
  if (doc?.image?.url && !doc.image.url.startsWith("https://")) {
    // Add BASE_URL only for local dev images
    doc.image.url = `${process.env.BASE_URL}/uploads/categories/${doc.image.url}`;
  }
};

// run on find, findOne, findOneAndUpdate, findOneAndDelete
categorySchema.post("init", (document) => {
  setImageURL(document);
});
// run on save or create a document which is creating a new document
categorySchema.post("save", (document) => {
  setImageURL(document);
});

module.exports = mongoose.model("Category", categorySchema);
