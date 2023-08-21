const express = require("express");

const productRouter = express.Router();
const {
  getProductValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require("../utils/validators/productValidator");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImges,
} = require("../controllers/productController");
const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("./reviewRoute");

/// Nested Route to nest child reviews inside parent products
productRouter.use("/:productId/reviews", reviewRouter);

productRouter
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadProductImages,
    resizeProductImges,
    createProductValidator,
    createProduct
  )
  .get(getProducts);

productRouter
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    protect,
    restrictTo("admin", "manager"),
    uploadProductImages,
    resizeProductImges,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, restrictTo("admin"), deleteProductValidator, deleteProduct);

module.exports = productRouter;
