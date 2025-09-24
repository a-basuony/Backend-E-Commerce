const Category = require("../models/category.model");

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

// read one
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

// create category
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

// update
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

// delete
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
