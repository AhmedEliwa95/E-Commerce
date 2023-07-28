const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name can not be less than 3 chars"],
      maxlength: [32, "Category name can not exceed 32 chars"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

//@ mongoose document middleware to set image URL + image name
// we used post not pre to save the image by the name and return it in the response as a URL
const setImageURL = (doc) => {
  if (doc.image) {
    // this imageURL will appear in the response only and will not be saved in the database
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageURL;
  }
};
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
