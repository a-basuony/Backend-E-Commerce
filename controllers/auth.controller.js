const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const ApiError = require("../utils/apiError");

const createToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// @desc    Signup user
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // 1. Create user
  const user = await User.create({ name, email, password });

  if (!user) {
    return next(new ApiError("Signup failed : User not found", 404));
  }

  // 2. Create token
  const token = createToken(user._id);

  res.status(201).json({
    message: "Signup successful",
    status: "success",
    data: user,
    token,
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @desc    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // 1. Check if user exists && password is correct
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Login failed : Invalid email or password", 401));
  }

  // 2. Create token
  const token = createToken(user._id);

  // 3. Send response
  res.status(200).json({
    message: "Login successful",
    status: "success",
    data: user,
    token,
  });
});
