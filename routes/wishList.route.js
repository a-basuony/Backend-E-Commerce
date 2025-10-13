const express = require("express");
const {
  addProductToWishList,
  removeProductFromWishList,
  getLoggedUserWishList,
} = require("../controllers/wishList.controller");

const { protected, allowTo } = require("../controllers/auth.controller");
const {
  addProductToWishListValidator,
  removeProductFromWishListValidator,
} = require("../utils/validators/wishListValidators");

const router = express.Router();

router.use(protected, allowTo("user"));

router
  .route("/")
  .get(getLoggedUserWishList)
  .post(addProductToWishListValidator, addProductToWishList);

router
  .route("/:productId")
  .delete(removeProductFromWishListValidator, removeProductFromWishList);
module.exports = router;
