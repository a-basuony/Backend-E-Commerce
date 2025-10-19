const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const expressAsyncHandler = require("express-async-handler");

const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");

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
    cartItems: cart.cartItems.map((item) => ({
      product: item.productId, // should be ObjectId
      quantity: item.quantity,
      price: item.price,
    })),
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

exports.setFilterObject = (req, res, next) => {
  let filter = {};
  if (req.user.role === "user") {
    filter = { user: req.user._id };
  }
  req.filterObject = filter;
  next();
};

// @desc    GET all orders
// @route   GET /api/v1/orders
// @access  private / admin
exports.getAllOrders = factory.getAll(Order);

// @desc    GET order by ID
// @route   GET /api/v1/orders/:id
// @access  private / user - admin -manager
exports.getSpecificOrder = factory.getOne(Order);

// @desc    Update order paid by id
// @route   PUT /api/v1/orders/:id/paid
// @access  private / admin
exports.updateOrderPaid = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  // update payment
  order.isPaid = true;
  order.paidAt = Date.now();

  const updateOrder = await order.save();
  res.status(200).json({
    status: "success",
    message: "Order paid successfully",
    data: updateOrder,
  });
});

// @desc    Update order delivered by id
// @route   PUT /api/v1/orders/:id/delivered
// @access  private / admin
exports.updateOrderDelivered = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  // update delivered
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updateOrder = await order.save();
  res.status(200).json({
    status: "success",
    message: "Order delivered successfully",
    data: updateOrder,
  });
});

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session
// @access  Private / user
exports.checkoutSession = expressAsyncHandler(async (req, res, next) => {
  // 1. get cart depend on logged user or cartId from params
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 2. Get order price depend on cart price " check if cart has discount or not "
  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount + taxPrice + shippingPrice
    : cart.totalCartPrice + taxPrice + shippingPrice;

  //3. create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: `Order by ${req.user.name}`,
            description: "E-commerce order payment", // optional
          },
          unit_amount: totalOrderPrice * 100, // amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    customer_email: req.user.email,
    client_reference_id: req.user._id.toString(),
    metadata: {
      userId: req.user._id.toString(),
      cartId: cart._id.toString(),
      shippingAddress: JSON.stringify(req.body.shippingAddress),
    },
  });

  // 4. send response
  res.status(200).json({
    status: "success",
    session,
  });
});

const createCardOrder = async (session) => {
  // const cartId = session.client_reference_id
  // const orderPrice = session.display_items[0].amount / 100;
  // const user = session.customer_email;

  const cartId = session.metadata.cartId;
  const userId = session.metadata.userId;
  const shippingAddress = JSON.parse(session.metadata.shippingAddress);

  // 1. get cart depend on Logged user or cartId from params
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return console.log("Cart not found");
  }

  // const user = await User.findById(userId);

  // 2. Calculate order total
  const totalOrderPrice = session.amount_total / 100;

  //3. create the order in Mongo DB
  const order = await Order.create({
    // user: user._id,
    user: userId,
    cartItems: cart.cartItems.map((item) => ({
      product: item.productId, // should be ObjectId
      quantity: item.quantity,
      price: item.price,
    })),
    shippingAddress: shippingAddress,
    totalOrderPrice: totalOrderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  if (order) {
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
  }
};

// @desc    This webhook will run when stripe payment successfully and  paid checkout session is completed
// @route   POST /webhook-checkout
// @access  Protected / User
exports.webhookCheckout = expressAsyncHandler(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("💳 Checkout session completed:", session.id);

    // Fulfill the order
    await createCardOrder(session);
  }

  res.status(200).json({ received: true });
});
