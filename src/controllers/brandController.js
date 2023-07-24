/* eslint-disable import/order */
const sharp = require("sharp");
const Brand = require("../models/brandModel");
const factory = require("../utils/handlerFactory");
const { v4: uuidv4 } = require("uuid");
const expressAsyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadIamgeMiddleware");

// @desc:  upload Category image to memory Using Multer
exports.uploadBrandImage = uploadSingleImage("image");

// @desc:  Image Processing
exports.resizeBrandImage = expressAsyncHandler(async (req, res, next) => {
  // const mime = req.file.mimetype.split("/")[1];
  const id = uuidv4();
  const filename = `category-${id}-${Date.now()}.jpeg`;
  // console.log(req.file);
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/uploads/brands/${filename}`);

  req.body.image = filename;
  next();
});

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
