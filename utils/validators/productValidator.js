const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/category.model");
const SubCategory = require("../../models/subcategory.model");
const Brand = require("../../models/brand.model");

exports.getProductValidators = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

exports.updateProductValidators = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

exports.deleteProductValidators = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

exports.createProductValidators = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long")
    .isLength({ max: 100 })
    .withMessage("Product title must be less than 100 characters long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Product description must be at lease 10 characters long")
    .isLength({ max: 2000 })
    .withMessage("Product description must be less that 2000 characters long"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 0 })
    .withMessage("Product quantity can't be less than 0"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isFloat({ min: 0, max: 20000 })
    .withMessage("Product price must be between 0 and 20000"),
  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product price after discount must be a number")
    .custom((value, { req }) => {
      if (req.body.price && value >= req.body.price) {
        throw new Error(
          "Price after discount must be less than original price"
        );
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be an array"),
  check("imageCover")
    .isString()
    .notEmpty()
    .withMessage("Product image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array"),
  check("category")
    .isMongoId()
    .withMessage("Invalid category id format")
    .notEmpty()
    .withMessage("Product category is required")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`Invalid category id format ${categoryId}`);
      }
      return true;
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory id format")
    .custom(async (subCategoriesIds, { req }) => {
      //1- check if subcategories ids are in DB
      const subcategoriesInDB = await SubCategory.find({
        _id: { $in: subCategoriesIds },
      });
      if (subcategoriesInDB.length !== subCategoriesIds.length) {
        throw new Error(
          `Invalid subcategories ids format : One or more Subcategories not found in DB${subCategoriesIds}`
        );
      }

      //2- check if subcategories ids are belong to same category
      const categoryId = req.body.category;

      const allMatch = subcategoriesInDB.every(
        (subCategory) => subCategory.category.toString() === categoryId
      );

      if (!allMatch) {
        throw new Error(
          "Some subcategories do not belong to the given category"
        );
      }

      return true;
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand id format")
    .custom(async (brandId) => {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        throw new Error(`Invalid brand id format ${brandId}`);
      }
      return true;
    }),
  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Product ratings average must be between 1.0 and 5.0"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratings quantity must be a number")
    .isInt({ min: 0 })
    .withMessage("Product ratings quantity must be at least 0"),
  validatorMiddleware,
];
