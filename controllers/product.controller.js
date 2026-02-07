const sharp = require("sharp");
const { v4: uuid } = require("uuid");
// const path = require("path"); // Unused if we don't save to disk
// const fs = require("fs"); // Unused
const asyncHandler = require("express-async-handler");
const cloudinaryService = require("../services/cloudinaryService");
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
  if (!req.files) return next();

  try {
    // 1. coverImage
    if (req.files.imageCover) {
      const coverImageName = `product-cover-${uuid()}-${Date.now()}`;
      const buffer = await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

      const uploadResult = await cloudinaryService.uploadStream(buffer, {
        folder: `ecommerce/products`,
        public_id: coverImageName,
        resource_type: "image",
      });
      req.body.imageCover = uploadResult.secure_url;
    }

    // 2. images
    if (req.files.images) {
      req.body.images = [];

      // Use Promise.all securely
      await Promise.all(
        req.files.images.map(async (file, index) => {
          const imageName = `product-${index}-${uuid()}-${Date.now()}`;
          const buffer = await sharp(file.buffer)
            .resize(800, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toBuffer();

          const uploadResult = await cloudinaryService.uploadStream(buffer, {
            folder: `ecommerce/products`,
            public_id: imageName,
            resource_type: "image",
          });
          req.body.images.push(uploadResult.secure_url);
        }),
      );
    }
  } catch (error) {
    console.error("❌ Image Processing/Upload Error:", error);
    return next(new ApiError(`Image upload failed: ${error.message}`, 500));
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
exports.getProduct = factory.getOne(Product, "reviews");

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
