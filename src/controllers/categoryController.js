/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
const Category = require("../models/categoryModel");
const factory = require("../utils/handlerFactory");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const expressAsyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadIamgeMiddleware");

// @desc:  upload Category image to memory Using Multer
exports.uploadCategoryImage = uploadSingleImage("image");

// @desc:  Image Processing
exports.resizeCategoryImage = expressAsyncHandler(async (req, res, next) => {
  // const mime = req.file.mimetype.split("/")[1];
  const id = uuidv4();
  const filename = `category-${id}-${Date.now()}.jpeg`;
  // console.log(req.file);
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/uploads/categories/${filename}`);

  // To save the url in the database but it's not effective
  // req.body.image =`${req.hostname}${filename}`;

  req.body.image = filename;
  next();
});

// @desc:    Get List of Categories
// @route:   GET /api/v1/categories
// @access:  Public
exports.getCategories = factory.getAll(Category, "Category");

// @desc     Get Specific Category By ID
// @route    GET api/v1/categories/:id
// @access   Public
exports.getCategory = factory.getOne(Category);

// @desc:     Create Category
// @route:    POST /api/v1/categories
// @access    Private: Admin & Manager
exports.createCategory = factory.createOne(Category);

// @desc    Update Category
// @route   PUT api/v1/categores/:id
// @access  Private: Admin & Manager
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete Category
// @route   delete api/v1/categores/:id
// @access  Private: Admin
exports.deleteCategory = factory.deleteOne(Category);
