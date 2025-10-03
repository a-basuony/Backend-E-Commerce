const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const Product = require("../models/product.model");

const factory = require("./handlersFactory");
const { uploadMixImages } = require("../middlewares/uploadImageMiddleware");

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   console.log(req.body);
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("Not an image! Please upload only images", 400), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// exports.uploadProductImage = upload.fields([
//   { name: "imageCover", maxCount: 1 },
//   { name: "images", maxCount: 5 },
// ]);

exports.uploadProductImage = uploadMixImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // if(!req.files.imageCover || !req.files.images) return next()
  if (!req.files) return next();

  // 1. folder path
  const dir = path.join(__dirname, "../uploads/products");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // create folder if not exist
  }

  //2. coverImage
  if (req.files.imageCover) {
    const coverImageName = `product-cover-${uuid()}-${Date.now()}.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${coverImageName}`); // save to folder

    req.body.imageCover = coverImageName; // save cover image name to body
  }

  //3. images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      // we use promise.all to wait for all images to be processed
      req.files.images.map(async (file, index) => {
        const imageName = `product-${index}-${uuid()}-${Date.now()}.jpeg`;
        await sharp(file.buffer)
          .resize(800, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`); // save to folder

        req.body.images.push(imageName);
      })
    );
  }

  next();
});

// @desc Get all products
// @route GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product, "Product");

// @desc       Get product by ID
// @route      GET /api/v1/products/:id
// @access     Public
exports.getProduct = factory.getOne(Product);

// @desc        Create Product
// @route       POST /api/v1/products
// @access      Private
exports.createProduct = factory.createOne(Product);

// @desc        Update Product by ID
// @route       PUT /api/v1/products/:id
// @access      Private
exports.updateProduct = factory.updateOne(Product);

// @desc        Delete Product by ID
// @route       DELETE /api/v1/products/:id
// @access      Private
exports.deleteProduct = factory.deleteOne(Product);
