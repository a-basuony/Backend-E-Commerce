const { faker } = require("@faker-js/faker");
const Category = require("../../models/category.model");
const SubCategory = require("../../models/subcategory.model");
const Brand = require("../../models/brand.model");
const slugify = require("slugify");

const seedCategories = async (count = 5) => {
  try {
    const categories = [];
    const subCategories = [];
    const brands = [];

    // Cloudinary demo images or placeholder images
    const categoryImages = [
      "https://res.cloudinary.com/demo/image/upload/v1652438692/sample.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1652438693/cld-sample-2.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1652438693/cld-sample-3.jpg",
    ];

    for (let i = 0; i < count; i++) {
      const categoryName =
        faker.commerce.department() + " " + faker.string.alpha(3); // Ensure uniqueness
      const category = await Category.create({
        name: categoryName,
        slug: slugify(categoryName, { lower: true }),
        image: {
          url: categoryImages[i % categoryImages.length],
          public_id: faker.string.uuid(),
        },
      });
      // categories.push(category); // Pushing the whole doc might be heavy if reusing.

      // Create Subcategories for each Category
      for (let j = 0; j < 3; j++) {
        let subName = faker.commerce.department() + " " + faker.string.alpha(3);
        if (subName.length > 30) {
          subName = subName.substring(0, 30);
        }
        await SubCategory.create({
          name: subName,
          slug: slugify(subName, { lower: true }),
          category: category._id,
        });
      }
    }
    console.log(`${count} Categories and Subcategories Seeded`.green.inverse);

    // Seed Brands
    for (let i = 0; i < 5; i++) {
      const brandName = faker.company.name() + " " + faker.string.alpha(2);
      await Brand.create({
        name: brandName,
        slug: slugify(brandName, { lower: true }),
        image:
          "https://res.cloudinary.com/demo/image/upload/v1652438690/shoe.jpg", // Simple string based on model
      });
    }
    console.log(`5 Brands Seeded`.green.inverse);
  } catch (error) {
    console.error("Error seeding categories/brands:".red, error);
    process.exit(1);
  }
};

module.exports = seedCategories;
