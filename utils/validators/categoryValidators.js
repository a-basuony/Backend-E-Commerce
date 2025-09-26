const { body, param, query } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCategoryValidations = [
  param("id").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];
