const express = require("express");

const categoryRouter = express.Router();
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../controllers/categoryController");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subCategoryRouter = require("./subCategoryRoute");
const { protect, restrictTo } = require("../controllers/authController");

categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

categoryRouter
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);

categoryRouter
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    restrictTo("admin", "manager"),
    uploadCategoryImage,
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protect,
    restrictTo("admin"),
    uploadCategoryImage,
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = categoryRouter;
