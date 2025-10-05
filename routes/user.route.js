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
const { protect, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router
  .route("/")
  .get(
    protect, // check token
    allowTo("admin", "manager"), // check role
    getUsers
  )
  .post(
    protect, // check token
    allowTo("admin"), // check role
    uploadUserImage,
    resizeUserImage,
    createUserValidators,
    createUser
  );
router
  .route("/:id")
  .get(getUserValidators, getUser)
  .put(
    protect, // check token
    allowTo("admin"), // check role
    uploadUserImage,
    resizeUserImage,
    updateUserValidators,
    updateUser
  )
  .delete(
    protect, // check token
    allowTo("admin"), // check role
    deleteUserValidators,
    deleteUser
  );

router.put("/changePassword/:id", changePasswordValidators, changePassword);

module.exports = router;
