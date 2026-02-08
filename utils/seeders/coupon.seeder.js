const { faker } = require("@faker-js/faker");
const Coupon = require("../../models/coupon.model");

const seedCoupons = async (count = 5) => {
  try {
    const coupons = [];

    for (let i = 0; i < count; i++) {
      coupons.push({
        name:
          faker.commerce.productMaterial().toUpperCase() +
          faker.number.int({ min: 10, max: 99 }),
        expire: faker.date.future(),
        discount: faker.number.int({ min: 5, max: 50 }),
      });
    }

    await Coupon.insertMany(coupons);
    console.log(`${coupons.length} Coupons Seeded`.green.inverse);
  } catch (error) {
    console.error("Error seeding coupons:".red, error);
    process.exit(1);
  }
};

module.exports = seedCoupons;
