// eslint-disable-next-line import/order
const sharp = require("sharp");
const expressAsyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const Product = require("../models/productModel");
const factory = require("../utils/handlerFactory");
const { uploadMixOfImages } = require("../middlewares/uploadIamgeMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 6 },
]);

exports.resizeProductImges = expressAsyncHandler(async (req, res, next) => {
  // console.log(req.files);
  // Image processing for imageCover
  if (req.files.imageCover) {
    const id = uuidv4();
    const imageCoverName = `product-${id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`src/uploads/products/${imageCoverName}`);

    req.body.imageCover = imageCoverName;
  }
  if (req.files.images) {
    req.body.images = [];

    const { images } = req.files;

    await Promise.all(
      images.map(async (img, index) => {
        const id = uuidv4();
        const imageName = `product-${id}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`src/uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );

    // console.log({ cover: req.body.imageCover }, { images: req.body.images });
  }
  next();
});

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
