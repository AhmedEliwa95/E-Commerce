const expressAsyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const APIError = require("../utils/apiError");
const Coupon = require("../models/couponModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice.toFixed(2);
  cart.totalPriceAfterDiscount = undefined;
};

// @desc:    Adding Product to a shopping cart
// @route:   Post /api/v1/carts
// @access:  Private/Protect-User
exports.addProductToShopCart = expressAsyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  if (!product) return next(new APIError("no product with this id"));

  // check if user not have a cart, if not then we will create a cart and add the product inside it,
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      cartItems: [{ product: productId, color, price: product.price }],
      user: req.user._id,
    });
    console.log("no cart");
  } else {
    // check if the user having a cart and the cart contains on the product we need to add, by the same color then
    //      we will increase the product quatity +1
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    console.log(productIndex);
    if (productIndex !== -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // if the user have a cart and not having the product that we need  to add, then we will add this product
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  // Calculate totalCartPrice
  calcTotalCartPrice(cart);

  await cart.save();
  // console.log(cart.cartItems[0]);

  res.status(200).json({
    status: "Success",
    message: "Product added to cart successfully",
    data: cart,
  });
});

// @desc:    Get logged user cart
// @route:   GET /api/v1/carts
// @access:  Private/Protect-User
exports.getMyCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new APIError("Your cart is empty", 400));
  res.status(200).json({
    status: "Success",
    message: "Your Shopping Cart",
    results: cart.cartItems.length,
    data: cart,
  });
});

// @desc:    Remove Product from a shopping cart
// @route:   DELETE /api/v1/carts/cartId
// @access:  Private/Protect-User
exports.removeProductfromCart = expressAsyncHandler(async (req, res, next) => {
  //1) find the cart and update it by pull the cart by cartID
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.cartId } },
    },
    { new: true }
  );
  //2) calculate the price after removing the product
  calcTotalCartPrice(cart);
  //3) savve the cart to the database
  await cart.save();
  //4)send your responce
  res.status(204).json({
    status: "Success",
    message: "the product has been deleted successfully from your cart",
    results: cart.cartItems.length,
    data: cart,
  });
});

// @desc:    Clear my shopping cart
// @route:   DELETE /api/v1/carts
// @access:  Private/Protect-User
exports.clearMyCart = expressAsyncHandler(async (req, res, next) => {
  //1) fund the cart
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send(cart);
});

// @desc:    Update cartItem quanity
// @route:   PUT /api/v1/carts/cartId
// @access:  Private/Protect-User
exports.updateCartItemQuantiy = expressAsyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new APIError("no cart for this user", 404));

  const productIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.cartId
  );
  if (productIndex !== -1) {
    const cartItem = cart.cartItems[productIndex];
    cartItem.quantity = quantity * 1;
    cart.cartItems[productIndex] = cartItem;
  } else {
    return next(new APIError(`no cartItem for this id:${req.params.cartId}`));
  }
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Your Shopping Cart",
    results: cart.cartItems.length,
    data: cart,
  });
});

// @desc:    Apply copoun on a shopping cart
// @route:   PUT /api/v1/carts/applyCoupon
// @access:  Private/Protect-User
exports.applyCoupon = expressAsyncHandler(async (req, res, next) => {
  //1) get coupon from req.body
  const { couponName } = req.body;
  const coupon = await Coupon.findOne({
    name: couponName,
    expire: { $gt: Date.now() },
  });
  //2) check if not coupon
  if (!coupon) {
    return next(new APIError("is invalid or expired", 404));
  }
  //3)find cart
  const cart = await Cart.findOne({ user: req.user._id });
  //4) set the priceAfterDiscount
  cart.totalPriceAfterDiscount = (
    cart.totalCartPrice *
    (1 - coupon.discount)
  ).toFixed(2);

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Your Shopping Cart",
    results: cart.cartItems.length,
    data: cart,
  });
});
