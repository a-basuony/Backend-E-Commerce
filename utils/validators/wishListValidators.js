const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Product = require("../../models/product.model");

exports.addProductToWishListValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (productId) => {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Invalid product id format ${productId}`);
      }
      return true;
    }),
  validatorMiddleware,
];
