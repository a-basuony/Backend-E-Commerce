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
} = require("../controllers/user.controller");
const { protected, allowTo } = require("../controllers/auth.controller");
const {
  createUserValidators,
  getUserValidators,
  updateUserValidators,
  deleteUserValidators,
  changePasswordValidators,
} = require("../utils/validators/userValidators");

// const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router.get("/getMe", protected, getLoggedUserData, getUser);
router.put(
  "/changeMyPassword",
  protected,
  getLoggedUserData,
  changePasswordValidators,
  updateLoggedUserPassword
);

// Apply protection & role restriction for all routes below
router.use(protected, allowTo("admin", "manager"));

//  /api/v1/users
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidators, createUser);

// /api/v1/users/:id
router
  .route("/:id")
  .get(getUserValidators, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidators, updateUser)
  .delete(deleteUserValidators, deleteUser);

// /api/v1/users/changePassword/:id
router.put("/changePassword/:id", changePasswordValidators, changePassword);

module.exports = router;
