const { default: mongoose } = require("mongoose");
const monogoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new monogoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      required: [true, `Rating is required for any review`],
      min: [1, "Minimum rating value is 1.0"],
      max: [5, "Maximum rating value is 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

reviewSchema.statics.calcAverageRatingAndQuantity = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        ratingsAverage: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(
      { _id: productId },
      {
        ratingsAverage: stats[0].ratingsAverage,
        ratingsQuantity: stats[0].ratingsQuantity,
      }
    );
  }
};

reviewSchema.post("save", async function (next) {
  await this.constructor.calcAverageRatingAndQuantity(this.product);
});
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
