const { faker } = require("@faker-js/faker");
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const SubCategory = require("../../models/subcategory.model");
const Brand = require("../../models/brand.model");
const slugify = require("slugify");

const seedProducts = async (count = 20) => {
  try {
    const categories = await Category.find();
    const brands = await Brand.find();
    const subCategories = await SubCategory.find();

    const products = [];

    if (categories.length === 0 || brands.length === 0) {
      console.log(
        "No categories or brands found. Skipping product seeding.".yellow,
      );
      return;
    }

    for (let i = 0; i < count; i++) {
      const title = faker.commerce.productName() + " " + faker.string.alpha(3);
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      // Filter subcategories that belong to this category
      const validSubCategories = subCategories.filter(
        (sub) => sub.category.toString() === category._id.toString(),
      );

      // Pick random subcategories (0 to 2)
      const productSubCategories = validSubCategories
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 1)
        .map((s) => s._id);

      const brand = brands[Math.floor(Math.random() * brands.length)];

      const price = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
      const discount = Math.floor(Math.random() * 20); // 0-20% discount
      const priceAfterDiscount =
        discount > 0
          ? (price - (price * discount) / 100).toFixed(2)
          : undefined;

      products.push({
        title: title,
        slug: slugify(title, { lower: true }),
        description: faker.commerce.productDescription(),
        quantity: faker.number.int({ min: 1, max: 100 }),
        sold: faker.number.int({ min: 0, max: 50 }),
        price: price,
        priceAfterDiscount: priceAfterDiscount,
        colors: [faker.color.human(), faker.color.human()],
        imageCover:
          "https://res.cloudinary.com/demo/image/upload/v1652438692/sample.jpg",
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1652438693/cld-sample-2.jpg",
          "https://res.cloudinary.com/demo/image/upload/v1652438693/cld-sample-3.jpg",
        ],
        category: category._id,
        subcategories: productSubCategories,
        brand: brand._id,
        ratingsAverage: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        ratingsQuantity: faker.number.int({ min: 0, max: 50 }),
      });
    }

    await Product.insertMany(products);
    console.log(`${count} Products Seeded`.green.inverse);
  } catch (error) {
    console.error("Error seeding products:".red, error);
    process.exit(1);
  }
};

module.exports = seedProducts;
