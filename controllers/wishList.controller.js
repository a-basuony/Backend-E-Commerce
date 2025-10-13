const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user.model");

// @desc    Add product to wish list
// @route   POST /api/v1/wishlist
// @access  Protected / user
exports.addProductToWishList = expressAsyncHandler(async (req, res, next) => {
  // $addToSet: adds an item to an array if it doesn't already exist
  // $pull: removes an item from an array if it exists
  const { productId } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: productId },
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    message: "Product added to wish list successfully",
    status: "success",
    data: user.wishList,
  });
});
