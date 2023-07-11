/* eslint-disable import/order */
const slugify = require("slugify");
const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const APIError = require("../utils/apiError");
const APIFeatures = require("../utils/APIFeature");
const factory = require("../utils/handlerFactory");

// @desc:    Get List of Brands
// @route:   GET /api/v1/brands
// @access:  Public
exports.getBrands = asyncHandler(async (req, res) => {
  // const page = req.query.page * 1 || 1;
  // // console.log(req.query);
  // const limit = req.query.limit * 1 || 5;
  // const skip = (page - 1) * limit;
  const countDocs = await Brand.countDocuments();
  const apiFeatures = new APIFeatures(Brand.find(), req.query)
    .filter()
    .paginate(countDocs)
    .sort()
    .fieldLimits()
    .search("Brand");
  const { mongooseQuery, paginationResult } = apiFeatures;
  const data = await mongooseQuery;
  // const brands = await Brand.find().skip(skip).limit(limit);
  res.status(200).send({
    results: data.length,
    paginationResult,
    data,
  });
});

// @desc     Get Specific Brand By ID
// @route    GET api/v1/brands/:id
// @access   Private
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new APIError(`no Brand with this ID: ${id}`, 404));
  }
  res.status(200).send({ data: brand });
});

// @desc:     Create Brand
// @route:    POST /api/v1/brands
// @access    Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const newBrand = await Brand.create({
    name,
    slug: slugify(name, { lower: true }),
  });

  res.status(201).json(newBrand);
});

// @desc    Update Brand
// @route   PUT api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete Brand
// @route   delete api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand);
