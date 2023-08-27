const express = require("express");

const cartRouter = express.Router();

const { addProductToShopCart } = require("../controllers/cartController");

const { protect, restrictTo } = require("../controllers/authController");

cartRouter.use(protect, restrictTo("user"));

cartRouter.route("/").post(addProductToShopCart);

module.exports = cartRouter;
