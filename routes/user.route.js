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
} = require("../utils/validators/UserValidators");

const router = express.Router();

router.put("/changePassword/:id", changePassword);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidators, createUser);
router
  .route("/:id")
  .get(getUserValidators, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidators, updateUser)
  .delete(deleteUserValidators, deleteUser);

module.exports = router;
