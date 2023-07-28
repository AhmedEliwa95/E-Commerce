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

const User = mongoose.model("User", userSchema);
module.exports = User;
