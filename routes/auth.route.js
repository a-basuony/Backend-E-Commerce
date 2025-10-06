const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/auth.controller");
const {
  signupValidators,
  loginValidators,
} = require("../utils/validators/authValidators");

const router = express.Router();

router.route("/signup").post(signupValidators, signup);
router.route("/login").post(loginValidators, login);
router.post("/forgotPassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
