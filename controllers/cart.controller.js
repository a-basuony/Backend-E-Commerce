/* eslint-disable no-use-before-define */
const expressAsyncHandler = require("express-async-handler");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const ApiError = require("../utils/apiError");

// helper function
function calcTotalCartPrice(cart) {
  let total = 0;

  // eslint-disable-next-line no-return-assign
  cart.cartItems.forEach((item) => (total += item.quantity * item.price));
  cart.totalCartPrice = total;
  cart.totalPriceAfterDiscount = undefined; // reset after any cart change
  // total price after discount it will not show until apply coupon only
}

// @desc    add to cart
// @route   POST /api/v1/cart
// @access  Private / user
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
// @access  Private / user
exports.getLoggedUserCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  // .populate(
  //   "cartItems.productId"
  // );

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Cart fetched successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    remove specific cart item
// @route   GET /api/v1/cart/:id
// @access  Private / user
exports.removeSpecificCartItem = expressAsyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
    },
    {
      $pull: {
        cartItems: { _id: itemId },
      },
    },
    { new: true }
  );

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart item removed successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private / user
exports.clearCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    // data: cart,
  });
});

// @desc    update cart item quantity
// @route   PUT /api/v1/cart/:id
// @access  Private / user
exports.updateCartItemQuantity = expressAsyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  const index = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId
  );
  if (index > -1) {
    cart.cartItems[index].quantity = quantity;
  }

  // Update total price or calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart item quantity updated successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private / user
exports.applyCoupon = expressAsyncHandler(async (req, res, next) => {
  const { couponName } = req.body;

  // 1️⃣ Find valid coupon
  const coupon = await Coupon.findOne({
    name: couponName,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError("Coupon not found", 404));
  }

  // 2️⃣ Find logged user cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  // 3️⃣ Calculate discounted price
  const discount = (cart.totalCartPrice * coupon.discount) / 100;
  cart.totalPriceAfterDiscount = parseFloat(
    (cart.totalCartPrice - discount).toFixed(2)
  );

  // 4️⃣ Update cart
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    data: cart,
  });
});
