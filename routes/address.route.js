const express = require("express");
const {
  addAddress,
  getAddresses,
  removeAddress,
  updateAddress,
} = require("../controllers/address.controller");
const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router.use(protected, allowTo("user"));

router.route("/").post(addAddress).get(getAddresses);

router.route("/:addressId").delete(removeAddress).put(updateAddress);

module.exports = router;
