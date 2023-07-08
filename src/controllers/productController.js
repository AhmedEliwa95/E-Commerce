// eslint-disable-next-line import/order
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const APIError = require("../utils/apiError");
const Product = require("../models/productModel");

// @desc:    Get List of products
// @route:   GET /api/v1/products
// @access:  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // 1-)Filtering
  const queryStringObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((field) => delete queryStringObj[field]);

  // Advanced Filtering, Appling greater & less than operator [gte] , [lt] , [lte] .....
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (oper) => `$${oper}`);

  // console.log(req.query);
  // console.log(queryStringObj);
  // console.log(JSON.parse(queryStr));
  // 2-) Pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  /// Build Mongoose Query or building the query, so we will remove await
  let mongooseQuery = Product.find(JSON.parse(queryStr))
    .limit(limit)
    .skip(skip);

  // 4-) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("createdAt");
  }

  // 5-) Field Limiting: to make the frontend call only essential fields for the client side
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // 6-) Searching
  if (req.query.keyword) {
    const query = {
      title: { $regex: `/${req.query.keyword}/`, $options: "i" },
    };
    // query.$or = [
    //   { title: { $regex: `/^${req.query.keyword}/`, $options: "i" } },
    //   { description: { $regex: `/${req.query.keyword}/`, $options: "i" } },
    // ];
    console.log(JSON.stringify(query));

    mongooseQuery = mongooseQuery.find(query);
  }

  /// Excute the mongoose query
  const products = await mongooseQuery;
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
  req.body.slug = slugify(req.body.title, { lower: true });

  const product = await Product.create(req.body);

  res.status(201).send({ data: product });
});

// @desc:     Update Product
// @route:    PUT /api/v1/products
// @access    Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true });
  }
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
