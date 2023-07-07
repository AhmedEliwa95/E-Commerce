/* eslint-disable arrow-body-style */

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

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
