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
} = require("../controllers/user.controller");

const {
  createUserValidators,
  getUserValidators,
  updateUserValidators,
  deleteUserValidators,
  changePasswordValidators,
} = require("../utils/validators/UserValidators");

const router = express.Router();

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidators, createUser);
router
  .route("/:id")
  .get(getUserValidators, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidators, updateUser)
  .delete(deleteUserValidators, deleteUser);

router.put("/changePassword/:id", changePasswordValidators, changePassword);

module.exports = router;
