const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("name length alowed from 3 to 100 chars"),
  check("description")
    .notEmpty()
    .withMessage("Product Description Required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Decription length between 20 to 2000 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Product Quantity is required")
    .isNumeric()
    .withMessage("Product quantity must to be a Number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must to be a Number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must to be a Number")
    .isLength({ max: 32 })
    .withMessage("Price Length must not exceed 32 digit"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a Number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must to be an Array of Colors"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must to be an Array of strings"),
  check("category")
    .notEmpty()
    .withMessage("Product category should be required")
    .isMongoId()
    .withMessage("Invalid CategoryId for this product"),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategoryId for this product"),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brandId for this product"),
  check("ratingsAverage")
    .isNumeric()
    .optional()
    .isLength({ min: 1, max: 5 })
    .withMessage("Product ratingsAverage should between 1 to 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsQuantity should be Numeric"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID"),
  validatorMiddleware,
];
