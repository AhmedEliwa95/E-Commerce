const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const APIError = require("../utils/apiError");

// @desc    Add  Address to User Addresses List
// @route   Post api/v1/addresses
// @access  Private: protected user
exports.addAddress = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  if (!user) {
    return next(new APIError("no user", 400));
  }

  res.status(201).send({
    status: "Success",
    message: "Address added Successfully to your addresses List",
    results: user.addresses.length,
    data: user.addresses,
  });
});

// @desc    Remove  address from adsressesList
// @route   DELETE api/v1/address/addressId
// @access  Private: protected user
exports.removeAddress = expressAsyncHandler(async (req, res, next) => {
  // 1) find the user from req.user._id
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      /// $pull to remove field from the array of subDocument
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  if (!user) {
    return next(new APIError("no user", 400));
  }

  res.status(204).send({
    status: "Success",
    message: "Address removed Successfully from your addressesList",
    data: user.addresses,
  });
});

// @desc    Get addresses for the logging user
// @route   GET api/v1/addresses
// @access  Private: protected user
exports.getMyAddresses = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).send({
    status: "Success",
    message: "My addressesList",
    results: user.addresses.length,
    data: user.addresses,
  });
});
