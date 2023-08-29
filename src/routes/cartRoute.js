const express = require("express");

const cartRouter = express.Router();

const {
  addProductToShopCart,
  getMyCart,
  removeProductfromCart,
  clearMyCart,
  updateCartItemQuantiy,
  applyCoupon,
} = require("../controllers/cartController");

const { protect, restrictTo } = require("../controllers/authController");

cartRouter.use(protect, restrictTo("user"));

cartRouter
  .route("/")
  .post(addProductToShopCart)
  .get(getMyCart)
  .delete(clearMyCart);

cartRouter
  .route("/:cartId")
  .put(updateCartItemQuantiy)
  .delete(removeProductfromCart);

cartRouter.route("/applyCoupon").post(applyCoupon);
module.exports = cartRouter;
