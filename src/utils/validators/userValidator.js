const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("name length alowed from 3 to 32 chars"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  check("name").optional(),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];
