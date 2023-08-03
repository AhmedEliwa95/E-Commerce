/* eslint-disable arrow-body-style */

const APIError = require("../utils/apiError");

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    Message: err.message,
    status: err.status,
    error: err,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    Message: err.message,
    status: err.status,
  });
};

const handleJwtInvalidSignature = () =>
  new APIError("Invalid Token, please login again", 401);

const handleJwtExpired = () =>
  new APIError("Expired session, please login again", 401);
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
