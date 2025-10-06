const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

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

// @desc    Protect routes to make sure user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1. Check if token exists in the header and extract it
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("You are not logged in to access this route", 401)
    );
  }

  // 2. verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Any JWT error will be handled globally in globalError middleware
    return next(err);
  }

  // 3. check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token does no longer exist", 401)
    );
  }

  // 4. Check if user changed password after token was issued
  // (optional but strongly recommended)
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError("User recently changed password. Please login again.", 401)
      );
    }
  }

  // 5. Grant access
  req.user = currentUser;
  next();
});

// @desc    Authorize user roles or permissions
// ["admin", "manager"] or seller
exports.allowTo = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

//@desc    Forget Password
//@route   POST /api/v1/auth/forgotPassword
//@access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  // console.log("reset token: " + resetToken);

  const hashedPasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log(hashedPasswordResetToken);
  user.passwordResetToken = hashedPasswordResetToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  try {
    // Send it to user's email
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message: `Your password reset token is: ${resetToken}.\n\nIf you did not request this, please ignore this email. \n\nThe token will expire in 10 minutes. \n\nBest regards, \nE-Shop App Team. \n\n `,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    return next(new ApiError("Email could not be sent", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset code sent to email",
  });
});

//@desc    Verify reset code
//@route   POST /api/v1/auth/verifyResetCode
//@access  Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedPasswordResetToken = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedPasswordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Reset code verified",
  });
});

//@desc    Reset Password
//@route   PUT /api/v1/auth/resetPassword
//@access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1. Check if user exists
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError("User not found for this email", 404));
  }
  // 2. Check if reset code is valid
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  // 3. Update password
  // user.password = await bcrypt.hash(req.body.password, 12);
  // because we hash the password in the pre middleware mongoose
  user.password = req.body.password;

  user.passwordChangedAt = Date.now();
  // 4. Clear reset token
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 5. generate token
  const token = createToken(user._id);

  res.status(200).json({
    message: "Password reset successful",
    status: "success",
    data: user,
    token,
  });
});
