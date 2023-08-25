const express = require("express");
const {
  addAddress,
  removeAddress,
  getMyAddresses,
} = require("../controllers/addressController");
const { protect, restrictTo } = require("../controllers/authController");

const addressRouter = express.Router();

addressRouter.use(protect, restrictTo("user"));

addressRouter.route("/").post(addAddress).get(getMyAddresses);

addressRouter.delete("/:addressId", removeAddress);
module.exports = addressRouter;
