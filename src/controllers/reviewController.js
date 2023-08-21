/* eslint-disable import/order */
const Review = require("../models/reviewModel");
const factory = require("../utils/handlerFactory");

// @desc:     Nested Route
// @route:    GET  /api/v1/products/:productId/reviews
module.exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObj = filterObject;
  next();
};

// @desc:    Get List of Reviews
// @route:   GET /api/v1/reviews
// @access:  Public
exports.getReviews = factory.getAll(Review, "");

// @desc     Get Specific Review By ID
// @route    GET api/v1/reviews/:id
// @access   public
exports.getReview = factory.getOne(Review);

// @desc:   set user from req.user._id , and set product from params.productId
module.exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  if (req.params.productId) req.body.product = req.params.productId;
  next();
};

// @desc:     Create Review
// @route:    POST /api/v1/Reviews
// @access    Private: Protect/user
exports.createReview = factory.createOne(Review);

// @desc    Update Review
// @route   PUT api/v1/Reviews/:id
// @access  Private: Protect/ User
exports.updateReview = factory.updateOne(Review);

// @desc    Delete Review
// @route   delete api/v1/Reviews/:id
// @access  Private: Protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(Review);
