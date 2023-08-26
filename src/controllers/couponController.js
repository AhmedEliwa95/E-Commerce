const expressAsyncHandler = require("express-async-handler");
const factory = require("../utils/handlerFactory");
const Coupon = require("../models/couponModel");

// @desc:    Get List of Coupons
// @route:   GET /api/v1/Coupons
// @access:  Private/Admin-Manager
exports.getCoupons = factory.getAll(Coupon, "");

// @desc     Get Specific Coupon By ID
// @route    GET api/v1/Coupons/:id
// @access   Private/Admin-Manager
exports.getCoupon = factory.getOne(Coupon);

// @desc:     Create Coupon
// @route:    POST /api/v1/Coupons
// @access    Private/Admin-Manager
exports.createCoupon = factory.createOne(Coupon);

// @desc    Update Coupon
// @route   PUT api/v1/Coupons/:id
// @access  Private/Admin/Manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc    Delete Coupon
// @route   delete api/v1/Coupons/:id
// @access  Private: Admin
exports.deleteCoupon = factory.deleteOne(Coupon);
