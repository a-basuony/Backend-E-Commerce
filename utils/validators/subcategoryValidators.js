const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidators = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidators = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  check("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("SubCategory name must be at least 2 characters long")
    .isLength({ max: 30 })
    .withMessage("SubCategory name must be less than 30 characters long").custom(
      (value, {req})=>{
        if(req.body.name){
          req.body.slug = slugify(value);
        }
        return true
      }
    ),
  
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id format for subcategory"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidators = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidators = [
  check("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("SubCategory name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("SubCategory name must be less than 30 characters long"),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to a category")
    .isMongoId()
    .withMessage("Invalid category id format for subcategory"),
  validatorMiddleware,
];
