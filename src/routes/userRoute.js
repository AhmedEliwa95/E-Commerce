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
  getMyProfile,
  updateMyPassword,
  updateMyProfile,
  deleteMe,
  activeMe,
} = require("../controllers/userController");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateMeValidator,
} = require("../utils/validators/userValidator");
const { protect, restrictTo } = require("../controllers/authController");

// const subBrandRouter = require("./subCategoryRoute");
// categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

/// Logged Users Routes
userRouter.use(protect);
userRouter.get("/getme", getMyProfile, getUser);
userRouter.put("/changeMyPassword", updateMyPassword);
userRouter.put("/uptademe", updateMeValidator, updateMyProfile);
userRouter.delete("/deleteme", deleteMe);
userRouter.put("/activeme", activeMe);

/// Admin Routes
userRouter.use(restrictTo("admin", "manager"));

userRouter.put(
  "/changepassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

userRouter
  .route("/")
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser)
  .get(getUsers);

userRouter
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = userRouter;
