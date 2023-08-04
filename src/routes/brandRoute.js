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
const { protect, restrictTo } = require("../controllers/authController");

// const subBrandRouter = require("./subCategoryRoute");
// categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

brandRouter
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);

brandRouter
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    restrictTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    protect,
    restrictTo("admin", "manager"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = brandRouter;
