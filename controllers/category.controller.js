const Category = require("../models/category.model");

//  * @desc Fetch a single category by its ID.
//  *       Validates the ID and returns the category data if found.
//  *       Throws an error if the ID is invalid or the category does not exist.
//  * @route GET /api/categories/:id
//  * @access Public
//  * @param {string} id - The MongoDB ObjectId of the category
//  * @returns {object} JSON containing category details
//  * @throws {Error} Invalid category ID or category not found

exports.getCategories = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;

    const categories = await Category.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Category.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "success",
      data: categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Fetch a single category by its ID.
 *       Validates the ID and returns the category data if found.
 *       Throws an error if the ID is invalid or the category does not exist.
 * @route GET /api/categories/:id
 * @access Public
 * @param {string} id - The MongoDB ObjectId of the category
 * @returns {object} JSON containing category details
 * @throws {Error} Invalid category ID or category not found
 **/
exports.getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "category not found " });
    }

    res.status(200).json({ message: "success", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  @desc Create a new category.
//  *       Accepts name, slug, and optional image.
//  *       Ensures the category name is unique.
//  *       Throws an error if name already exists or validation fails.
//  * @route POST /api/categories
//  * @access Public
//  * @body {string} name - Name of the category (required)
//  * @body {string} slug - URL-friendly slug for the category (required)
//  * @body {string} image - Optional image URL for the category
//  * @returns {object} JSON containing the created category
//  * @throws {Error} If category name is duplicate or invalid data
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    const category = await Category.create({ name, slug, image });
    res.status(201).json({ message: "creating category", data: category });
  } catch (error) {
    // التعامل مع duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name must be unique" });
    }
    res.status(500).json({ message: error.message });
  }
};

//  * @desc Update an existing category by its ID.
//  *       Updates fields like name and slug.
//  *       Validates that the category exists before updating.
//  *       Throws an error if category not found or ID is invalid.
//  * @route PUT /api/categories/:id
//  * @access Public
//  * @param {string} id - The MongoDB ObjectId of the category to update
//  * @body {string} name - Updated name of the category (optional)
//  * @body {string} slug - Updated slug for the category (optional)
//  * @returns {object} JSON containing the updated category
//  * @throws {Error} If category not found or invalid IDexports.updateCategory = async (req, res) => {
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, slug } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    category.name = name;
    await category.save();
    res.status(200).json({
      message: "updating category",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  * @desc Delete a category by its ID.
//  *       Removes the category from the database.
//  *       Throws an error if the category does not exist or ID is invalid.
//  * @route DELETE /api/categories/:id
//  * @access Public
//  * @param {string} id - The MongoDB ObjectId of the category to delete
//  * @returns {object} JSON containing the deleted category
//  * @throws {Error} If category not found or invalid ID
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    res.status(200).json({ message: "deleting category", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
