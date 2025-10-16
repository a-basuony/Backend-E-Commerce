const express = require("express");
const { createCashOrder } = require("../controllers/order.controller");

const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();
router.use(protected, allowTo("user"));
router.route("/").post(createCashOrder);

module.exports = router;
