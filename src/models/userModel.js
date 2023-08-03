const bcrypt = require("bcryptjs");
const { default: slugify } = require("slugify");

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name required"],
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "User email is required"],
    unique: [true, "This email have been registerd"],
    lowercase: true,
  },
  phone: {
    type: String,
  },
  profileImg: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "User password required"],
    minlength: [8, "User password must be greater than 8 chars"],
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// @desc: Hashing the Password & slugify the Name
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  this.slug = slugify(this.name);
  next();
});

// userSchema.post("save", function (next) {
//   delete this.password;
//   next();
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
