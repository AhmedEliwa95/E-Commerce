/* eslint-disable import/order */
const sharp = require("sharp");
const User = require("../models/userModel");
const factory = require("../utils/handlerFactory");
const { v4: uuidv4 } = require("uuid");
const expressAsyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadIamgeMiddleware");
const APIError = require("../utils/apiError");
const bcrypt = require("bcryptjs");

// @desc:  upload Category image to memory Using Multer
exports.uploadUserImage = uploadSingleImage("profileImg");

// @desc:  Image Processing
exports.resizeUserImage = expressAsyncHandler(async (req, res, next) => {
  // const mime = req.file.mimetype.split("/")[1];
  if (!req.file) return next();
  const id = uuidv4();
  const filename = `user-${id}-${Date.now()}.jpeg`;
  // console.log(req.file);
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/uploads/users/${filename}`);

  req.body.profileImg = filename;
  next();
});

// @desc:    Get List of Users
// @route:   GET /api/v1/users
// @access:  private: admin
exports.getUsers = factory.getAll(User, "");
// @desc     Get Specific User By ID
// @route    GET api/v1/users/:id
// @access   Private: admin
exports.getUser = factory.getOne(User);

// @desc:     Create User
// @route:    POST /api/v1/users
// @access    Private:admin
exports.createUser = factory.createOne(User);

// @desc    Update User
// @route   PUT api/v1/users/:id
// @access  Private: admin
exports.updateUser = expressAsyncHandler(async (req, res, next) => {
  if (req.body.password) {
    delete req.body.password;
  }
  const updatedDocument = await User.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  await updatedDocument.save();

  if (!updatedDocument) {
    return next(
      new APIError(`No Document with this ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).send({ data: updatedDocument });
});

exports.changeUserPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    { password: await bcrypt.hash(req.body.password, 8) },
    { new: true }
  );
  if (!user) {
    return next(new APIError(`no user with this ID:${req.params.id}`, 404));
  }

  res.status(200).json(user);
});
// @desc    Delete User
// @route   delete api/v1/users/:id
// @access  Private
exports.deleteUser = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    { active: false },
    { new: true, runValidators: true }
  );
  if (!user) {
    return next(new APIError(`no user with this ID: ${req.params.id}`, 404));
  }
  res.status(204).send(user);
});
