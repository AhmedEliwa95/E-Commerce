const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [2, "Brand name can not be less than 2 chars"],
      maxlength: [32, "Brand name can not exceed 32 chars"],
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

brandSchema.pre("save", () => {
  this.slug = slugify(this.name, { lower: true });
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
