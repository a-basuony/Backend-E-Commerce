const { faker } = require("@faker-js/faker");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");

const seedOrders = async (count = 10) => {
  try {
    const products = await Product.find();
    const users = await User.find({ role: "user" });

    if (products.length === 0 || users.length === 0) {
      console.log("No products or users found. Skipping order seeding.".yellow);
      return;
    }

    for (let i = 0; i < count; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const cartItems = [];
      let totalOrderPrice = 0;

      const numberOfItems = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < numberOfItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        const price = product.price;

        cartItems.push({
          product: product._id, // User logic might expect cartItems to populate product. The order schema uses product: ObjectId, ref: 'Product' inside array.
          quantity: quantity,
          price: price,
          color:
            product.colors && product.colors.length > 0
              ? product.colors[0]
              : "black",
        });
        totalOrderPrice += price * quantity;
      }

      const taxPrice = 0;
      const shippingPrice = 0;
      totalOrderPrice += taxPrice + shippingPrice;

      const isPaid = Math.random() > 0.5;
      const isDelivered = isPaid && Math.random() > 0.5;

      await Order.create({
        user: user._id,
        cartItems: cartItems,
        shippingAddress: {
          details:
            user.addresses && user.addresses.length > 0
              ? user.addresses[0].details
              : faker.location.streetAddress(),
          city:
            user.addresses && user.addresses.length > 0
              ? user.addresses[0].city
              : faker.location.city(),
          phone: user.phone || faker.phone.number(),
          postalCode:
            user.addresses && user.addresses.length > 0
              ? user.addresses[0].postalCode
              : faker.location.zipCode(),
        },
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
        totalOrderPrice: totalOrderPrice,
        paymentMethodType: Math.random() > 0.3 ? "card" : "cash",
        isPaid: isPaid,
        paidAt: isPaid ? faker.date.recent() : undefined,
        isDelivered: isDelivered,
        deliveredAt: isDelivered ? faker.date.recent() : undefined,
      });
    }

    console.log(`${count} Orders Seeded`.green.inverse);
  } catch (error) {
    console.error("Error seeding orders:".red, error);
    process.exit(1);
  }
};

module.exports = seedOrders;
