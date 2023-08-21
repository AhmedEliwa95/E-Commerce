const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
  // getSubCategoriesForCategory,
} = require("../controllers/subCategoryCotroller");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const { protect, restrictTo } = require("../controllers/authController");

// mergeParams: to access params in other routes : to access subcategories according to categoryId
const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories);

subCategoryRouter
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    protect,
    restrictTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    restrictTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

// subCategoryRouter.route("/:categoryId/subcategories").get(getSubCategoriesForCategory);

module.exports = subCategoryRouter;
