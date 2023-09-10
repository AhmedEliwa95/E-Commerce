const express = require("express");
const { restrictTo, protect } = require("../controllers/authController");
const {
  createCashOrder,
  getAllOrders,
  filterOrdersForLoggedUser,
  updateOrderToDelivered,
  updateOrderToPaid,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.post("/:cartId", protect, restrictTo("user"), createCashOrder);
orderRouter.use(protect);

orderRouter.get(
  "/",
  restrictTo("user", "admin", "manager"),
  filterOrdersForLoggedUser,
  getAllOrders
);

orderRouter
  .route("/orderId")
  .get(restrictTo("user", "admin", "manager"), filterOrdersForLoggedUser);

orderRouter.put(
  "/:orderId/deliver",
  restrictTo("admin", "manager"),
  updateOrderToDelivered
);

orderRouter.put(
  "/:orderId/pay",
  restrictTo("admin", "manager"),
  updateOrderToPaid
);

module.exports = orderRouter;
