const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const APIError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const { createAndSendToken } = require("../utils/createToken");

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

// @DESC: Authorization: Users Premisions
exports.restrictTo = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // console.log(req.user.role);
      return next(new APIError("Forbiden, not allowed to this route", 403));
    }
    next();
  });

//////// Forgot Password Controllers \\\\\\\\\

// @desc:   forgotPassword: send reset code to the email
// @Route:  POST api/v1/auth/forgotPassword
// @access: Public
exports.forgotPassword = expressAsyncHandler(async (req, res, next) => {
  // 1) check if are there a user with req.body.email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new APIError(`${req.body.email}: not a registerd email`, 404));

  // 2) if exist then generate random 6 digits
  const resetCode = Math.floor(Math.random() * 10 ** 6).toString();
  // 3) hash this resetCode before saving it to the database
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // console.log({ resetCode });
  // console.log({ hashedResetCode });
  // 4) save this hashedResetcode to the database
  user.passwordResetCode = hashedResetCode;
  // 5) make password resetCode only available for ten minutes
  user.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  // 6) change the password reset varified to false
  user.passwordResetVerified = false; // will change to true after verification

  // 6) save the user in the data base
  await user.save();
  // 3) send the reset code to the email
  try {
    await sendEmail({
      email: user.email,
      subject: `your password reset code is valid for Ten Mins`,
      message: `Hi ${user.name} 
    We recieved a request to reset the password on your E-Shop Account 
     ${resetCode} 
     Enter this code to complete the reset.  
     Thanks for helping us keep your account secure.
     The E-Shop Team`,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpired = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new APIError("There is an error in sending the emails", 500));
  }
  res.status(200).json({
    staus: "Success",
    message: `Reset code sent to email:${user.email}`,
  });
});

// @desc:   verifyPassword: Check if the hashedResetPassword stored in the DB is the same
// @Route:  POST api/v1/auth/verifyPassword
// @access: Public

exports.verifyResetPassword = expressAsyncHandler(async (req, res, next) => {
  // 1) get the user by the resetCode
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpired: { $gt: Date.now() }, // to check it it expired
  });
  if (!user) return next(new APIError("invalid or expired reset code", 404));
  console.log(user);

  // 3) verify
  user.passwordResetVerified = true;
  user.save();

  res.status(200).json({ status: "Success" });
});

// @desc:   Reset Password
// @Route:  PUT api/v1/auth/resetPassword
// @access: Public
exports.resetPassword = expressAsyncHandler(async (req, res, next) => {
  // 1) Get the user by the email from the body of the request
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new APIError(`${req.body.email} is an invalid email`, 404));

  // 2) check is the password verified or not
  if (!user.passwordResetVerified)
    return next(new APIError("Reset code not verified", 400));

  // 3) PUT the password to the new password from the body of the request
  user.password = req.body.newPassword;

  // 4) set all password reset code paramaters to undefined and save the user
  user.passwordResetCode = undefined;
  user.passwordResetExpired = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  // send token
  createAndSendToken(user, 200, res);
});
