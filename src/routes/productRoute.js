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

productRouter
  .route("/")
  .post(
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
    uploadProductImages,
    resizeProductImges,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = productRouter;
