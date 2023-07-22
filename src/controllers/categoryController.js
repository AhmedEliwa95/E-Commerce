/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
const Category = require("../models/categoryModel");
const APIError = require("../utils/apiError");
const factory = require("../utils/handlerFactory");
const multer = require("multer");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// DiskStorage Engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "src/uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     // category-${id}-Date.now.extention
//     const mime = file.mimetype.split("/")[1];
//     const id = uuidv4();
//     const name = `category-${id}-${Date.now()}.${mime}`;

//     cb(null, name);
//   },
// });

// Memmory Storage Engine
const multerStorage = multer.memoryStorage();

/// Filter for image
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    // console.log({ file });
    cb(null, true);
  } else {
    cb(new APIError(`Only Image Allowed`, 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// @desc:  upload Category image Using Multer
exports.uploadCategoryImage = upload.single("image");

// @desc:  Resizing images uploading
exports.resizeCategoryImage = (req, res, next) => {
  console.log(req.file);
  // sharp(req.fil)
};

// @desc:    Get List of Categories
// @route:   GET /api/v1/categories
// @access:  Public
exports.getCategories = factory.getAll(Category, "Category");

// @desc     Get Specific Category By ID
// @route    GET api/v1/categories/:id
// @access   Private
exports.getCategory = factory.getOne(Category);

// @desc:     Create Category
// @route:    POST /api/v1/categories
// @access    Private
exports.createCategory = factory.createOne(Category);

// @desc    Update Category
// @route   PUT api/v1/categores/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete Category
// @route   delete api/v1/categores/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);
