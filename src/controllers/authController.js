const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const APIError = require("../utils/apiError");

const generateJWT = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

// @desc:    signup
// @route:   POST /api/v1/auth/signup
// @access:  public
exports.signup = expressAsyncHandler(async (req, res, next) => {
  //1- Create the user
  if (req.body.role) delete req.body.role;
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  //2- generate JWT
  const token = generateJWT(user._id, user.role);
  // 3- remove the password from the responce
  user.password = undefined;
  //4- send the user and the token in the responce
  res.status(201).send({ data: user, token });
});

exports.login = expressAsyncHandler(async (req, res, next) => {
  // 1- find user by Email
  const user = await User.findOne({ email: req.body.email });
  // 2- check if not user then send not found
  if (!user) return next(new APIError("Incorrect email or password", 401));
  // 3- compare the request's password with user db password
  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );
  // 4- if the password not correct then send password or email not correct
  if (!isPasswordCorrect)
    return next(new APIError("Incorrect email or password", 401));
  // 5- undefine the password
  user.password = undefined;
  // 5- create JWT
  const token = generateJWT(user._id, user.role);
  // 6- send the user and the token in the responce
  res.status(200).send({ data: user, token });
});
