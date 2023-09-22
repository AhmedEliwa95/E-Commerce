const stripe = require("stripe")(process.env.STRIPE_SECRET);
const expressAsyncHandler = require("express-async-handler");
const factory = require("../utils/handlerFactory");
const APIError = require("../utils/apiError");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

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

// @desc:    Update order paid status by ID
// @route:   PUT /api/v1/orders/orderId
// @access:  Private: , Admin, Manager
exports.updateOrderToPaid = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.orderId);
  if (!order) {
    return next(
      new APIError(401, `no order with this orderId: ${req.params.orderId}`)
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "Success", data: updatedOrder });
});

// @desc:    Update order delivered status by ID
// @route:   PUT /api/v1/orders/orderId
// @access:  Private: , Admin, Manager
exports.updateOrderToDelivered = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.orderId);
  if (!order) {
    return next(
      new APIError(401, `no order with this orderId: ${req.params.orderId}`)
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "Success", data: updatedOrder });
});

// @desc:    Create CheckOut Session from stripe and send it as a response to allow it for the frontend to use it by the public_key
// @route:   GET /api/v1/orders/checkout-session/cartId
// @access:  Private: user
exports.checkoutSession = expressAsyncHandler(async (req, res, next) => {
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

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // name: req.user.name,
        // amount: totalOrderPrice * 100,
        // price:{}
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: { name: req.user.name },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`, ///req.protocol: http or https, req.get('host):
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  //4) send the session
  res.status(200).json({
    status: "Success",
    session,
  });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_details.email });

  // create order with card payement method
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    shippingAddress,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: "card",
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
    await Cart.findByIdAndDelete(cart._id);
  }
};
// @desc:    Create webhook checkout
// @route:   GET /api/v1/orders/webhook-checkout
// @access:  Private: user
exports.createWebhook = expressAsyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  /// handle the event to create the order
  if (event.type === "checkout.session.completed") {
    /// Create Order from the session sent
    createCardOrder(event.data.object);
  }

  res.status(200).json({ recieved: true });

  // // Return a 200 response to acknowledge receipt of the event
  // res.send();
});
