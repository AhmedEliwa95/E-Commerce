const express = require("express");

const cartRouter = express.Router();

const {
  addProductToShopCart,
  getMyCart,
  removeProductfromCart,
} = require("../controllers/cartController");

const { protect, restrictTo } = require("../controllers/authController");

cartRouter.use(protect, restrictTo("user"));

cartRouter.route("/").post(addProductToShopCart).get(getMyCart);
cartRouter.route("/:cartId").delete(removeProductfromCart);

module.exports = cartRouter;
