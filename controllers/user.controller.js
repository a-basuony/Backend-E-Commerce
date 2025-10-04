// CRUD operations for Admin only
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { resizeImage } = require("../middlewares/resizeImageMiddleware");
const ApiError = require("../utils/apiError");

exports.uploadUserImage = uploadSingleImage("profileImage");
exports.resizeUserImage = resizeImage("users", "user");
// @desc    Get all Users with pagination
// @route   GET /api/users
// @access  Private for admin only
exports.getUsers = factory.getAll(User);

// @desc    Change user password
// @route   PUT /api/users/changePassword/:id
// @access  Private for admin only
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const oldDocument = await User.findById(id);
  if (!oldDocument) {
    return next(
      new ApiError(`Update failed : Document not found for id: ${id}`, 404)
    );
  }
  const document = await User.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
    },
    { new: true }
  );
  if (!document) {
    return next(
      new ApiError(`Update failed : password not found for id: ${id}`, 404)
    );
  }
  res.status(200).json({
    message: "password has been changed",
    data: document,
  });
});

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
