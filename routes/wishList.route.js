const express = require("express");
const { addProductToWishList } = require("../controllers/wishList.controller");

const { protected, allowTo } = require("../controllers/auth.controller");
const {
  addProductToWishListValidator,
} = require("../utils/validators/wishListValidators");

const router = express.Router();

router
  .route("/")
  .post(
    protected,
    allowTo("user"),
    addProductToWishListValidator,
    addProductToWishList
  );

module.exports = router;
