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
      /// Parent Refernce (One Parent Product : Many Childs Reviews   )
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

// aggregate pipeLine to match all the reviews with the same productId and aggregate them to
// sum how many reviews and calculate the averge , then we will update ratingsAverge and ratingsQuantity
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

// to trigger saving in Post & Put
reviewSchema.post("save", async function (next) {
  await this.constructor.calcAverageRatingAndQuantity(this.product);
});

// /// now we need to implement this aggegate during findOneAndUpdate and findOneAndDelete queries
// /// then we have to use query middleware but we will have an issue which we can't use this.costructor
// /// because in this case this will refer to find, so le's see how we can solve this issue
// /// we have to use post but we can't do this because the query has already excuted
// reviewSchema.pre(/^findOneAndDelete/, async function (next) {
//   /// this Hack to access to the review and to save this var to the next middleware
//   // console.log("MW");
//   this.r = await this.findOne();
//   console.log(this.r);
//   next();
// });
// /// now we can use post on the query middleware
// reviewSchema.post(/^findOneAndDelete/, async function () {
//   // this.r =await this.findOne() :: does not work here because the query has already excuted
//   await this.r.constructor.calcAverageRatingAndQuantity(this.r.product);
// });
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
