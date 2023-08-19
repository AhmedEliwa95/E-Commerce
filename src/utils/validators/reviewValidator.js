const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Rating required for the review")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between One to Five"),
  check("product").isMongoId().withMessage("Invalid Product ID"),
  check("user")
    .isMongoId()
    .withMessage("Invalid User ID")
    .custom(async (val, { req }) => {
      //Check if the loged user ceate review before to make the user create only one review
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) throw new Error("You already reviewed this product");
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .custom(async (val, { req }) => {
      // Check review ownership before update
      const review = await Review.findById(val);
      if (!review) throw new Error("Invalid Review ID");
      if (review.user.toString() !== req.user._id.toString()) {
        throw new Error("not allowed to do this action");
      }
    }),
  // check("user").custom(async (val, { req }) => {
  //   val = req.body.user._id;
  //   const user = await User.findOneById(req.body.user._id);
  //   // if(user)
  // }),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .custom(async (val, { req }) => {
      // Check review ownership before update
      const review = await Review.findById(val);
      if (!review) throw new Error("Invalid Review ID");
      if (req.user.role === "user") {
        if (review.user.toString() !== req.user._id.toString()) {
          throw new Error("not allowed to do this action");
        }
      }
    }),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];
