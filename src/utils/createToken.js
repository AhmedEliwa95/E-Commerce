const jwt = require("jsonwebtoken");

// @Desc to create a token
const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

//@Desc create and send a token
module.exports.createAndSendToken = (user, statusCode, res) => {
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

  // res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({ data: user, token });
};
