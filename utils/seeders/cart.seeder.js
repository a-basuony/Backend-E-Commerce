const { faker } = require("@faker-js/faker");
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");

const seedCarts = async (count = 5) => {
  try {
    const products = await Product.find();
    const users = await User.find({ role: "user" });

    if (products.length === 0 || users.length === 0) {
      console.log("No products or users found. Skipping cart seeding.".yellow);
      return;
    }

    // Seed carts for 5 random users
    const selectedUsers = users.sort(() => 0.5 - Math.random()).slice(0, count);

    for (const user of selectedUsers) {
      const cartItems = [];
      let totalCartPrice = 0;

      const numberOfItems = Math.floor(Math.random() * 3) + 1; // 1-3 items

      for (let i = 0; i < numberOfItems; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        const price = product.price;

        cartItems.push({
          productId: product._id,
          quantity: quantity,
          price: price, // Current product price
          color:
            product.colors && product.colors.length > 0
              ? product.colors[0]
              : "black",
        });

        totalCartPrice += price * quantity;
      }

      await Cart.create({
        user: user._id,
        cartItems: cartItems,
        totalCartPrice: totalCartPrice,
        totalPriceAfterDiscount: undefined, // undefined unless coupon applied
      });
    }

    console.log(`${selectedUsers.length} Carts Seeded`.green.inverse);
  } catch (error) {
    console.error("Error seeding carts:".red, error);
    process.exit(1);
  }
};

module.exports = seedCarts;
