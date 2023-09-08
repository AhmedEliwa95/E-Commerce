const mongoose = require("mongoose");
const slugify = require("slugify");

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
      // required: true,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// to create a vertual field without saving this field in the database
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// return the url in the queries
const setImageURL = (doc) => {
  // fixing pug populating products inside order.cartItems
  if (!doc.images) return;

  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images.length > 0) {
    // eslint-disable-next-line array-callback-return
    doc.images.map((img, index) => {
      doc.images[index + 1] = `${process.env.BASE_URL}/products/${img}`;
    });
  }
};

productSchema.post("init", (doc) => {
  setImageURL(doc);
});
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

// Populating parent model
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

// productSchema.pre(/^findById/, async function (next) {
//   await this.populate({ path: "reviews" });
//   next();
// });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
