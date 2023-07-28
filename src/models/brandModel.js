const mongoose = require("mongoose");

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

const setImageURL = (doc) => {
  if (doc.image) {
    // this imageURL will appear in the response only and will not be saved in the database
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageURL;
  }
};
brandSchema.post("init", (doc) => {
  setImageURL(doc);
});
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

brandSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = this.name.split(" ").join("-").toLowerCase();
  }
  next();
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
