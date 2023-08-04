const express = require("express");

const authRouter = express.Router();

const {
  signup,
  login,
  forgotPassword,
} = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

// const subBrandRouter = require("./subCategoryRoute");
// categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

authRouter.post("/signup", signupValidator, signup);
authRouter.post("/login", loginValidator, login);
authRouter.post("/forgotPassword", forgotPassword);

module.exports = authRouter;
