const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  setFilterObject,
  getSpecificOrder,
} = require("../controllers/order.controller");

const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();
router.use(protected);
router
  .route("/")
  .get(allowTo("user", "admin", "manager"), setFilterObject, getAllOrders)
  .post(allowTo("user"), createCashOrder);
router.route("/:id").get(allowTo("user", "admin", "manager"), getSpecificOrder);

module.exports = router;
