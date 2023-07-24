const express = require("express");

const brandRouter = express.Router();
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../controllers/brandController");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

// const subBrandRouter = require("./subCategoryRoute");
// categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

brandRouter
  .route("/")
  .post(uploadBrandImage, resizeBrandImage, createBrandValidator, createBrand)
  .get(getBrands);

brandRouter
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, resizeBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = brandRouter;
