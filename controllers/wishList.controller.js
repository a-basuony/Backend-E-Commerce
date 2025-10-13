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

// @desc    Remove product to wish list
// @route   DELETE /api/v1/wishlist/:productId
// @access  Protected / user
exports.removeProductFromWishList = expressAsyncHandler(
  async (req, res, next) => {
    // $addToSet: adds an item to an array if it doesn't already exist
    // $pull: removes an item from an array if it exists
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishList: productId },
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      message: "Product removed from wish list successfully",
      status: "success",
      data: user.wishList,
    });
  }
);

// @desc    Get wish list
// @route   GET /api/v1/wishlist
// @access  Private / user
exports.getLoggedUserWishList = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");
  res.status(200).json({
    message: "Wish list fetched successfully",
    status: "success",
    results: user.wishList.length,
    data: user,
  });
});
