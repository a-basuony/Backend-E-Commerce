const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user.model");

// $addToSet: adds an item to an array if it doesn't already exist
// $pull: removes an item from an array if it exists

// @desc    Add addresses to user addresses list
// @route   POST /api/v1/addresses
// @access  Protected / user
exports.addAddress = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } }, // prevent duplicates
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

// @desc    Remove addresses from user addresses list
// @route   DELETE /api/v1/addresses/:addressesId
// @access  Protected / user
exports.removeAddress = expressAsyncHandler(async (req, res, next) => {
  //$pull => removes an addresses object  item from a user addresses array if it exists
  const { addressId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
    data: user.addresses,
  });
});

// @desc    Get logged user addresses list
// @route   GET /api/v1/addresses
// @access  Private / user
exports.getAddresses = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});

exports.updateAddress = expressAsyncHandler(async (req, res, next) => {
  const { addressId } = req.params;

  const user = await User.findOneAndUpdate(
    { _id: req.user._id, "addresses._id": addressId },
    {
      $set: {
        "addresses.$.alias": req.body.alias,
        "addresses.$.details": req.body.details,
        "addresses.$.phone": req.body.phone,
        "addresses.$.city": req.body.city,
        "addresses.$.postalCode": req.body.postalCode,
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address updated successfully",
    data: user,
  });
});
