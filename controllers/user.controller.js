// CRUD operations for Admin only
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");

const User = require("../models/user.model");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { resizeImage } = require("../middlewares/resizeImageMiddleware");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

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
// // @access  Private/ admin
exports.createUser = factory.createOne(User);

// if we want to update the hole document data
// exports.updateUser = factory.updateOne(User, {
//   imageFolder: "users",
// });

// @desc    Update User by ID
// @route   PUT /api/users/:id
// @access  Private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const oldDocument = await User.findById(id);
  if (!oldDocument) {
    return next(
      new ApiError(`Update failed : Document not found for id: ${id}`, 404)
    );
  }

  if (req.file && oldDocument.image) {
    const oldImagePath = path.join(
      __dirname,
      `../uploads/users/${oldDocument.image}`
    ); // old image path
    fs.unlink(oldImagePath, (err) => {
      if (err) console.log("⚠️ Failed to delete old image:", err.message);
    });
  }

  const document = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    { new: true }
  );
  if (!document) {
    return next(
      new ApiError(`Update failed : Document not found for id: ${id}`, 404)
    );
  }
  res.status(200).json({
    message: "Document updated",
    data: document,
  });
});

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
      passwordChangedAt: Date.now(),
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

// @desc    Delete User by ID
// @route   DELETE /api/users/:id
// @access  Private/admin
exports.deleteUser = factory.deleteOne(User);

// @desc    Get Logged User Data
// @route   GET /api/users/getMe
// @access  Private / Protected
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update Logged User Password
// @route   PUT /api/users/changeMyPassword
// @access  Private / Protected
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1. Get user from DB and include password field
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  // in validation
  // // 2. Optional: verify current password (if sent)
  // if (req.body.currentPassword) {
  //   const isMatch = await bcrypt.compare(
  //     req.body.currentPassword,
  //     user.password
  //   );
  //   if (!isMatch) {
  //     return next(new ApiError("Current password is incorrect", 400));
  //   }
  // }

  // 3. Set the new password
  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now();

  // 4. Save the user (triggers pre('save') → hashes the password)
  await user.save();

  // 5. Generate new token
  const token = createToken(user._id);

  // 6. Send response
  res.status(200).json({
    message: "Password has been changed successfully ✅",
    token,
  });
});
