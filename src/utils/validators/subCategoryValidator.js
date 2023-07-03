const validatorMiddleware = require("../../middlewares/validator");

// eslint-disable-next-line import/order
const { check } = require("express-validator");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("name length alowed from 2 to 32 chars"),
  check("category")
    .notEmpty()
    .withMessage("Sub Category Must belong to Parent Category")
    .isMongoId()
    .withMessage("Invalid Parent Category ID"),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID"),
  // check("category").isMongoId().withMessage("Invalid 2 SubCategory ID"),
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("name length alowed from 2 to 32 chars"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];
