const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const APIError = require("../utils/apiError");

// @Desc to create a token
const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

//@Desc create and send a token
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    maxAge: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // to make the cookie can't be access or modified in anyway on the browser
    httpOnly: true,
  };
  // to make it works with https only
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  user.password = undefined;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({ data: user, token });
};

// @desc:    signup
// @route:   POST /api/v1/auth/signup
// @access:  public
exports.signup = expressAsyncHandler(async (req, res, next) => {
  //1- Create the user
  if (req.body.role) delete req.body.role;
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  //2- generate JWT and sent the token
  createAndSendToken(user, 201, res);
  // const token = signToken(user._id);
  // // 3- remove the password from the responce
  // user.password = undefined;
  // //4- send the user and the token in the responce
  // res.status(201).send({ data: user, token });
});

// @desc:    login
// @route:   POST /api/v1/auth/login
// @access:  public
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

  createAndSendToken(user, 200, res);
  // // 5- undefine the password
  // user.password = undefined;
  // // 5- create JWT
  // const token = signToken(user._id);
  // // 6- send the user and the token in the responce
  // res.status(200).send({ data: user, token });
});

exports.protect = expressAsyncHandler(async (req, res, next) => {
  //1) check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log(token);
  }
  // else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }
  if (!token) {
    return next(new APIError("Please Login to get access", 401));
  }

  //2) Verify token(No change happend or it's not expired)
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  //3) check if user exist
  const user = await User.findById(decoded.userId);
  if (!user) return next(new APIError("Invalid user", 401));

  //4) check if user change the password after the token created
  if (user.passwordChangedAt > new Date(decoded.iat * 1000)) {
    return next(new APIError("User have to login again", 401));
  }

  //5) send the user as a property in the request
  req.user = user;
  next();
});
