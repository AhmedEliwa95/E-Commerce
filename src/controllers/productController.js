// eslint-disable-next-line import/order
const Product = require("../models/productModel");
const factory = require("../utils/handlerFactory");
// @desc:    Get List of products
// @route:   GET /api/v1/products
// @access:  Public
exports.getProducts = factory.getAll(Product, "Product");
// @desc     Get Specific Product By ID
// @route    GET api/v1/products/:id
// @access   public
exports.getProduct = factory.getOne(Product);

// @desc:     Create Product
// @route:    POST /api/v1/products
// @access    Private

exports.createProduct = factory.createOne(Product);

// @desc:     Update Product
// @route:    PUT /api/v1/products
// @access    Private
exports.updateProduct = factory.updateOne(Product);

// @desc:     Delete Product
// @route:    DELETE /api/v1/products
// @access    Private
exports.deleteProduct = factory.deleteOne(Product);
