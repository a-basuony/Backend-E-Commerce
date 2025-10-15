/* eslint-disable no-use-before-define */
const expressAsyncHandler = require("express-async-handler");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");

// helper function
function calcTotalCartPrice(cart) {
  let total = 0;

  // eslint-disable-next-line no-return-assign
  cart.cartItems.forEach((item) => (total += item.quantity * item.price));
  cart.totalCartPrice = total;
}

// @desc    add to cart
// @route   POST /api/v1/cart
// @access  Public / user
exports.addToCart = expressAsyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  // 1/ get cart for logged user
  // Check if user already has a cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          productId: productId,
          color: color,
          price: product.price,
        },
      ],
    });
  } else {
    // check if product already exists in cart
    const index = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId && item.color === color
    );

    if (index > -1) {
      // product already exists in cart
      // Increase quantity
      cart.cartItems[index].quantity += 1;
    } else {
      // add new product
      cart.cartItems.push({
        productId: productId,
        color: color,
        price: product.price,
      });
    }
  }

  // Update total price or calculate total cart price
  calcTotalCartPrice(cart);

  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Product added to cart",
    data: cart,
  });
});

// @desc    Get all logged user cart
// @route   GET /api/v1/cart
// @access  Public / user
exports.getLoggedUserCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Cart fetched successfully",
    results: cart.cartItems.length,
    data: cart,
  });
});
