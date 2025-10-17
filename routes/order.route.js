const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  setFilterObject,
  getSpecificOrder,
  updateOrderPaid,
  updateOrderDelivered,
} = require("../controllers/order.controller");

const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();
router.use(protected);
router
  .route("/")
  .get(allowTo("user", "admin", "manager"), setFilterObject, getAllOrders)
  .post(allowTo("user"), createCashOrder);
router.route("/:id").get(allowTo("user", "admin", "manager"), getSpecificOrder);
router.route("/:id/paid").put(allowTo("admin"), updateOrderPaid);
router.route("/:id/delivered").put(allowTo("admin"), updateOrderDelivered);

module.exports = router;
