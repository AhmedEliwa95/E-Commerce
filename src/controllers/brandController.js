/* eslint-disable import/order */
const Brand = require("../models/brandModel");
const factory = require("../utils/handlerFactory");

// @desc:    Get List of Brands
// @route:   GET /api/v1/brands
// @access:  Public
exports.getBrands = factory.getAll(Brand, "");
// @desc     Get Specific Brand By ID
// @route    GET api/v1/brands/:id
// @access   Private
exports.getBrand = factory.getOne(Brand);

// @desc:     Create Brand
// @route:    POST /api/v1/brands
// @access    Private
exports.createBrand = factory.createOne(Brand);

// @desc    Update Brand
// @route   PUT api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete Brand
// @route   delete api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand);
