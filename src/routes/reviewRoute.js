const express = require("express");

const reviewRouter = express.Router({ mergeParams: true });
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdAndUserIdToBody,
} = require("../controllers/reviewController");

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const { protect, restrictTo } = require("../controllers/authController");

// const subBrandRouter = require("./subCategoryRoute");
// categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

reviewRouter
  .route("/")
  .post(
    protect,
    restrictTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  )
  .get(createFilterObject, getReviews);

reviewRouter
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, restrictTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    restrictTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = reviewRouter;
