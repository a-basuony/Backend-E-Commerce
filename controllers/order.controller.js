const expressAsyncHandler = require("express-async-handler");

const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const ApiError = require("../utils/apiError");

// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Private / user
exports.createCashOrder = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  // instead of userId we can use productId from params and find cart by productId
  // route => /api/v1/orders/:cartId
  //1. Get user cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  //2. Calculate order total
  const taxPrice = 0;
  const shippingPrice = 0;

  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount + taxPrice + shippingPrice
    : cart.totalCartPrice + taxPrice + shippingPrice;

  //3. create new order
  const order = await Order.create({
    user: userId,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: totalOrderPrice,
  });

  // 4. Decrease product quantity and increase sold after creating order, decrement product quantity, increment product sold
  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));

  if (cart.cartItems.length > 0) {
    await Product.bulkWrite(bulkOption);
  }
  // 5. clear user cart
  await Cart.deleteOne({ user: userId });

  // 6. send response
  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
});

// {
//   "shippingAddress": {
//     "details": "123 Street, Downtown",
//     "city": "Cairo",
//     "phone": "01123456789",
//     "postalCode": "11511"
//   }
// }

// -------------
/// when get single product it will be

//         "quantity": 20,
//          "sold": 0,

// after order it will be  => quantity : 18, sold : 2

// ----------- response
// {
//     "status": "success",
//     "message": "Order created successfully",
//     "data": {
//         "user": "68ea6ed5afd5e9a36ada3116",
//         "cartItems": [
//             {
//                 "quantity": 1,
//                 "price": 100,
//                 "color": "blue",
//                 "_id": "68f103542e5ab3c98058f690"
//             },
//             {
//                 "quantity": 1,
//                 "price": 100,
//                 "color": "red",
//                 "_id": "68f103652e5ab3c98058f69a"
//             }
//         ],
//         "shippingAddress": {
//             "details": "123 Street, Downtown",
//             "city": "Cairo",
//             "phone": "01123456789",
//             "postalCode": "11511"
//         },
//         "taxPrice": 0,
//         "shippingPrice": 0,
//         "totalOrderPrice": 200,
//         "paymentMethodType": "cash",
//         "isPaid": false,
//         "isDelivered": false,
//         "_id": "68f104d1d5809e526a6c9d97",
//         "createdAt": "2025-10-16T14:44:33.176Z",
//         "updatedAt": "2025-10-16T14:44:33.176Z",
//         "__v": 0
//     }
// }

// get logged user cart item after order it will be nothing because cart will be deleted

// when you can apply coupon after add to cart and before order
// the totalOrderPrice it will be after discount
// after order you can't apply coupon
