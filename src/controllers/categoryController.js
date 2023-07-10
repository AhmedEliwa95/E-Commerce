/* eslint-disable import/order */
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const APIError = require("../utils/apiError");
const factory = require("../utils/handlerFactory");

// @desc:    Get List of Categories
// @route:   GET /api/v1/categories
// @access:  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  // console.log(req.query);
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const categories = await Category.find().skip(skip).limit(limit);
  res.status(200).send({
    data: {
      results: categories.length,
      page,
      categories,
    },
  });
});

// @desc     Get Specific Category By ID
// @route    GET api/v1/categories/:id
// @access   Private
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    return next(new APIError(`no category with this ID: ${id}`, 404));
  }
  res.status(200).send({ data: category });
});

// @desc:     Create Category
// @route:    POST /api/v1/categories
// @access    Private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const newCategory = await Category.create({
    name,
    slug: slugify(name, { lower: true }),
  });

  res.status(201).json(newCategory);
});

// @desc    Update Category
// @route   PUT api/v1/categores/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updatedCategory = await Category.findOneAndUpdate(
    { _id: id },
    {
      name,
      slug: slugify(name, { lower: true }),
    },
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    return next(new APIError(`no category with this ID: ${id}`, 404));
  }

  res.status(200).send({ data: updatedCategory });
});

// @desc    Delete Category
// @route   delete api/v1/categores/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);
// asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const deletedCategory = await Category.findOneAndDelete({ _id: id });
//   if (!deletedCategory) {
//     return next(new APIError(`no category with this ID: ${id}`, 404));
//   }

//   res.status(204).send();
// });
