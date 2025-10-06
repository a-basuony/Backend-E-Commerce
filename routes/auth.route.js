const express = require("express");
const {
  signup,
  login,
  forgetPassword,
} = require("../controllers/auth.controller");
const {
  signupValidators,
  loginValidators,
} = require("../utils/validators/authValidators");

const router = express.Router();

router.route("/signup").post(signupValidators, signup);
router.route("/login").post(loginValidators, login);
router.post("/forgotPassword", forgetPassword);

module.exports = router;
