const express = require("express");
const {
  addAddress,
  getAddresses,
  removeAddress,
  updateAddress,
} = require("../controllers/address.controller");
const { protected, allowTo } = require("../controllers/auth.controller");
const {
  addAddressValidator,
  updateAddressValidator,
} = require("../utils/validators/addressValidators");

const router = express.Router();

router.use(protected, allowTo("user"));

router.route("/").post(addAddressValidator, addAddress).get(getAddresses);

router
  .route("/:addressId")
  .delete(removeAddress)
  .put(updateAddressValidator, updateAddress);

module.exports = router;
