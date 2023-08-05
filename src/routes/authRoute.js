const express = require("express");

const authRouter = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyResetPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

// const subBrandRouter = require("./subCategoryRoute");
// categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

authRouter.post("/signup", signupValidator, signup);
authRouter.post("/login", loginValidator, login);
/// When forgetting the password
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/verifyResetCode", verifyResetPassword);
authRouter.put("/resetPassword", resetPasswordValidator, resetPassword);

module.exports = authRouter;
