const express = require("express");
const {
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
} = require("../controllers/coupon.controller");

const { protected, allowTo } = require("../controllers/auth.controller");

const router = express.Router();

router.use(protected, allowTo("admin"));

router.route("/").get(getAllCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
