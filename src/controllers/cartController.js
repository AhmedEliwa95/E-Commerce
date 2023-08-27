const expressAsyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const APIError = require("../utils/apiError");

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
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  await cart.save();

  console.log(cart.cartItems[0]);
  // if the user have a cart and not having the product that we need  to add, then we will add this product
  //   const product = await Product.findById(req.body.product);
  //   const cart = await Cart.create({
  //     cartItems: {
  //       $addToSet: { product: product._id },
  //       $addToSet: { quantity: product._id },
  //     },
  //   });
});
