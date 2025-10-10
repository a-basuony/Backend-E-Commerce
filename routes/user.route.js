const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
  changePassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../controllers/user.controller");

const { protected, allowTo } = require("../controllers/auth.controller");
const {
  createUserValidators,
  getUserValidators,
  updateUserValidators,
  deleteUserValidators,
  changePasswordValidators,
  updateLoggedUserDataValidator,
} = require("../utils/validators/userValidators");

const router = express.Router();

/* ===============================
   👤 Logged User Routes
================================= */
router.use(protected);

// ✅ Get my data
router.get("/getMe", getLoggedUserData, getUser);

// ✅ Update my password
router.put(
  "/changeMyPassword",
  getLoggedUserData,
  changePasswordValidators,
  updateLoggedUserPassword
);

// ✅ Update my profile (without password, role, active)
router.put("/updateMe", updateLoggedUserDataValidator, updateLoggedUserData);

router.get("/deleteMe", deleteLoggedUserData);
/* ===============================
   👑 Admin Routes
================================= */
router.use(protected, allowTo("admin", "manager"));

// ✅ CRUD routes for admin
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidators, createUser);

// ✅ Important: this must come AFTER /updateMe
router
  .route("/:id")
  .get(getUserValidators, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidators, updateUser)
  .delete(deleteUserValidators, deleteUser);

// ✅ Admin change password for specific user
router.put("/changePassword/:id", changePasswordValidators, changePassword);

module.exports = router;
