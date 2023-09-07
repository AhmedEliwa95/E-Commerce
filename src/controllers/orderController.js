const expressAsyncHandler = require("express-async-handler");
const factory = require("../utils/handlerFactory");
const APIError = require("../utils/apiError");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// @desc:    create cash order for products in the cart
// @route:   POST /api/v1/orders/cartId
// @access:  Private: Protected-User
exports.createCashOrder = expressAsyncHandler(async (req, res, next) => {
  // 1) get cart by the cartId
  // 2) get cart prrice & check for applied coupons
  // 3) create order with cash payement method
  // 4) decrement the product quantity according to the number of product inside the cart
  // 5) increment the product sold     according to the number of product inside the cart
  // 6) clear the cart by the cartId

  /// app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) get the cart
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) return next(new APIError("no cart with this cartId", 404));

  // 2) check price
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  // 3) create order with cach payment method
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    taxPrice,
    shippingPrice,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  // 4) decrement thee product auantity
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOptions, {});

    // 5) clear the cart
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "Success", data: order });
});

// helper function to filter the logged user orders only
exports.filterOrdersForLoggedUser = expressAsyncHandler(
  async (req, res, next) => {
    if (req.user.role === "user") req.filterObj = { user: req.user._id };
    next();
  }
);

// @desc:    Get all orders for admin or managers, or get only the order belonget to the logged user with role user
// @route:   POST /api/v1/orders
// @access:  Private: Protected-User, Admin, Manager
exports.getAllOrders = factory.getAll(Order);

// @desc:    Get order by ID
// @route:   POST /api/v1/orders/cartId
// @access:  Private: Protected-User, Admin, Manager
exports.getOrder = factory.getOne(Order);
