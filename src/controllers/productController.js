// eslint-disable-next-line import/order
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const APIError = require("../utils/apiError");
const Product = require("../models/productModel");

// @desc:    Get List of products
// @route:   GET /api/v1/products
// @access:  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find().limit(limit).skip(skip);

  res.status(200).json({
    results: products.length,
    page,
    data: products,
  });
});

// @desc     Get Specific Product By ID
// @route    GET api/v1/products/:id
// @access   public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new APIError(`no product with this ID: ${id}`, 404));
  }
  res.status(200).send({ data: product });
});

// @desc:     Create Product
// @route:    POST /api/v1/products
// @access    Private

exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name, { lower: true });

  const product = await Product.create(req.body);

  res.status(201).send({ data: product });
});

// @desc:     Update Product
// @route:    PUT /api/v1/products
// @access    Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name, { lower: true });
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    next(new APIError(`no product with this ID: ${id}`, 404));
  }
  res.status(200).send({ data: product });
});

// @desc:     Delete Product
// @route:    DELETE /api/v1/products
// @access    Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ _id: id });

  if (!product) {
    next(new APIError(`no product with this ID: ${id}`, 404));
  }
  res.status(204).send();
});
