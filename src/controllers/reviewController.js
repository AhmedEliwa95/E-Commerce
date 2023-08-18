/* eslint-disable import/order */
const Review = require("../models/reviewModel");
const factory = require("../utils/handlerFactory");

// @desc:    Get List of Reviews
// @route:   GET /api/v1/reviews
// @access:  Public
exports.getReviews = factory.getAll(Review, "");

// @desc     Get Specific Review By ID
// @route    GET api/v1/reviews/:id
// @access   public
exports.getReview = factory.getOne(Review);

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
