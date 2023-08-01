const express = require("express");

const userRouter = express.Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
  changeUserPassword,
} = require("../controllers/userController");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");
const { signup } = require("../controllers/authController");
const { signupValidator } = require("../utils/validators/authValidator");

// const subBrandRouter = require("./subCategoryRoute");
// categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

userRouter
  .route("/")
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser)
  .get(getUsers);

userRouter
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

userRouter.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

module.exports = userRouter;
