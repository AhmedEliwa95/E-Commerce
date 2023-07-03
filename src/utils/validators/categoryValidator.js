const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("name length alowed from 3 to 32 chars"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];
