// CRUD operations for Admin only

const User = require("../models/user.model");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { resizeImage } = require("../middlewares/resizeImageMiddleware");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeUserImage = resizeImage("users", "user");
// @desc    Get all Users with pagination
// @route   GET /api/users
// @access  Private for admin only
exports.getUsers = factory.getAll(User);

// @desc    Get single User by ID
// @route   GET /api/users/:id
// @access  Private for admin only
exports.getUser = factory.getOne(User);

// @desc    Create new User
// @route   POST /api/users
// // @access  Private
exports.createUser = factory.createOne(User);

// @desc    Update User by ID
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = factory.updateOne(User, {
  imageFolder: "users",
});

// @desc    Delete User by ID
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);
