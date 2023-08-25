const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const APIError = require("../utils/apiError");

// @desc    Add  product to the wishList User
// @route   Post api/v1/wishList
// @access  Private: protected user
exports.addProductToWishList = expressAsyncHandler(async (req, res, next) => {
  // 1) find the user from req.user._id
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      /// $addToSet to prevent duplication
      $addToSet: { wishList: req.body.productId },
    },
    { new: true }
  );
  if (!user) {
    return next(new APIError("no user", 400));
  }

  res.status(201).send({
    status: "Success",
    message: "Product added Successfully to your wishList",
    data: user.wishList,
  });
});

// @desc    Remove  product from the wishList of the User
// @route   DELETE api/v1/wishList/productId
// @access  Private: protected user
exports.removeProductFromWishList = expressAsyncHandler(
  async (req, res, next) => {
    // 1) find the user from req.user._id
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        /// $pull to remove field from the array of subDocument
        $pull: { wishList: req.params.productId },
      },
      { new: true }
    );
    if (!user) {
      return next(new APIError("no user", 400));
    }

    res.status(204).send({
      status: "Success",
      message: "Product removed Successfully from your wishList",
      data: user.wishList,
    });
  }
);

// @desc    Get wishList for the logging yser
// @route   GET api/v1/wishList
// @access  Private: protected user
exports.getMyWishList = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");
  //   .populate("wishList");
  console.log(user);
  res.status(200).send({
    status: "Success",
    message: "My wishList",
    data: user.wishList,
  });
});
