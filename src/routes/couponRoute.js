const express = require("express");

const couponRouter = express.Router();
const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../utils/validators/brandValidator");
const { protect, restrictTo } = require("../controllers/authController");

couponRouter.use(protect, restrictTo("admin", "manager"));

couponRouter.route("/").post(createCoupon).get(getCoupons);

couponRouter
  .route("/:id")
  .get(getCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = couponRouter;
