const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const User = require("../../models/userModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.createReviewValidator = [
  check("title")
    .isLength({ max: 500 })
    .withMessage("Maximum title length is 500 chars"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID"),
  check("user").custom(async (val, { req }) => {
    val = req.body.user._id;
    const user = await User.findOneById(req.body.user._id);
    // if(user)
  }),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.deleteReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];
