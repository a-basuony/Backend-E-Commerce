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

const {
  createUserValidators,
  getUserValidators,
  updateUserValidators,
  deleteUserValidators,
  changePasswordValidators,
} = require("../utils/validators/UserValidators");

const { protect, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router.get("/getMe", protect, getLoggedUserData, getUser);
router.get(
  "/updateMyPassword",
  protect,
  // changePasswordValidators,
  updateLoggedUserPassword
);

//  Apply protection & role restriction for all routes below
router.use(protect, allowTo("admin", "manager"));

//  /api/v1/users
router
  .route("/")
  .get(getUsers)
  .post(
    allowTo("admin"),
    uploadUserImage,
    resizeUserImage,
    createUserValidators,
    createUser
  );

// /api/v1/users/:id
router
  .route("/:id")
  .get(getUserValidators, getUser)
  .put(
    allowTo("admin"),
    uploadUserImage,
    resizeUserImage,
    updateUserValidators,
    updateUser
  )
  .delete(allowTo("admin"), deleteUserValidators, deleteUser);

// /api/v1/users/changePassword/:id
router.put(
  "/changePassword/:id",
  allowTo("admin"),
  changePasswordValidators,
  changePassword
);

module.exports = router;
