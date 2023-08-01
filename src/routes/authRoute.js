const express = require("express");

const authRouter = express.Router();

const { signup, login } = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

// const subBrandRouter = require("./subCategoryRoute");
// categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

authRouter.post("/signup", signupValidator, signup);
authRouter.post("/login", loginValidator, login);

module.exports = authRouter;
