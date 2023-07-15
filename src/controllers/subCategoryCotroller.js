const SubCategory = require("../models/subCategoryModel");
const factory = require("../utils/handlerFactory");

// middleware before the validator to use the get the category from the categoryId
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc:     Create subCategory
// @route:    POST /api/v1/subCategories
// @access    Private
// @route:    POST /api/v1/categories/categoryId/subcategories : to Create subCategories for category by nestedRoute
module.exports.createSubCategory = factory.createOne(SubCategory);

// @desc:     Get All subCategories
// @route:    get /api/v1/subCategories
// @access:   Public
// @route:    GET /api/v1/categories/categoryId/subcategories : to get subCategories for category
module.exports.getSubCategories = factory.getAll(SubCategory, "");

// @desc:     Get Specific subCategory
// @route:    get /api/v1/subCategories/:id
// @access    Public
module.exports.getSubCategory = factory.getOne(SubCategory);

// @desc:     Update Specific subCategory
// @route:    PUT /api/v1/subCategories/:id
// @access    Private
module.exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc:     Delete Specific subCategory
// @route:    DELTE /api/v1/subCategories/:id
// @access    Private
module.exports.deleteSubCategory = factory.deleteOne(SubCategory);

// @desc:     Get subCategories for specific category
// @route:    GET /api/v1/caregory/categoryId/subcategories  :: Nested Route
// @access    Public
////////// we will use nested Route
// module.exports.getSubCategoriesForCategory = asyncHandler(async (req, res) => {
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 5;
//   const skip = (page - 1) * limit;

//   const categoryId = req.params.id;

//   const subCategories = await SubCategory.find({ category: categoryId })
//     .limit(limit)
//     .skip(skip);

//   res.status(200).send({
//     data: {
//       results: subCategories.length,
//       subCategories,
//     },
//   });
// });
