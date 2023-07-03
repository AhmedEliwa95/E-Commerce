const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("name length alowed from 3 to 32 chars"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];
