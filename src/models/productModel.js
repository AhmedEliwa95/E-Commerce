const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short title length"],
      maxlength: [100, "Too long title length"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [10 ** 10, "Too high product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Category must belong to Product"],
      ref: "Category",
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal to one"],
      max: [5, "Rating must be less or equal to Five"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.slug = this.title.split(" ").join("-").toLowerCase();
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  })
    .populate({
      path: "subCategories",
      select: "name -_id ",
    })
    .populate({
      path: "brand",
      select: "name -_id",
    });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
