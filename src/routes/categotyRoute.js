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

categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

categoryRouter
  .route("/")
  .post(
    resizeCategoryImage,
    uploadCategoryImage,
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);

categoryRouter
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = categoryRouter;
