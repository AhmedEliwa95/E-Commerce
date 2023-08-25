const express = require("express");
const {
  addProductToWishList,
  removeProductFromWishList,
  getMyWishList,
} = require("../controllers/wishListController");
const { protect, restrictTo } = require("../controllers/authController");

const wishListRouter = express.Router();

wishListRouter.use(protect, restrictTo("user"));

wishListRouter.route("/").post(addProductToWishList).get(getMyWishList);

wishListRouter.delete("/:productId", removeProductFromWishList);
module.exports = wishListRouter;
