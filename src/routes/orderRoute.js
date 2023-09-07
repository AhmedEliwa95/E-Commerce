const express = require("express");
const { restrictTo, protect } = require("../controllers/authController");
const {
  createCashOrder,
  getAllOrders,
  filterOrdersForLoggedUser,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.post("/:cartId", protect, restrictTo("user"), createCashOrder);
orderRouter.use(protect, restrictTo("user", "admin", "manager"));
orderRouter.get("/", filterOrdersForLoggedUser, getAllOrders);
orderRouter.get("/orderId", filterOrdersForLoggedUser);

module.exports = orderRouter;
