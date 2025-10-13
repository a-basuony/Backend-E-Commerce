const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: [true, "Coupon name already exists"],
    required: [true, "Coupon name is required"],
  },
  expire: {
    type: Date,
    required: [true, "Coupon expire date is required"],
  },
  discount: {
    type: Number,
    required: [true, "Coupon discount is required"],
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
