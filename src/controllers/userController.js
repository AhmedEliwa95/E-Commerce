/* eslint-disable import/order */
const sharp = require("sharp");
const User = require("../models/userModel");
const factory = require("../utils/handlerFactory");
const { v4: uuidv4 } = require("uuid");
const expressAsyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadIamgeMiddleware");
const APIError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const { createAndSendToken } = require("../utils/createToken");

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
    return next(
      new APIError(
        `use this route to change your password: ${process.env.BASE_URL}/api/v1/users/changePassword/${req.params.id}`,
        404
      )
    );
    // delete req.body.password;
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

// @desc    Update User Password
// @route   PUT api/v1/users/:id
// @access  Private: protected user
exports.changeUserPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      password: await bcrypt.hash(req.body.password, 8),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return next(new APIError(`no user with this ID:${req.params.id}`, 404));
  }

  res.status(200).json(user);
});

// @desc    Delete User
// @route   delete api/v1/users/:id
// @access  Private/Admin
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

// @desc     Get My Profile
// @route    GET api/v1/users/myProfile
// @access   Private: protect
exports.getMyProfile = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc     Update profile password
// @route    PUT api/v1/users/updateMyPassword
// @access   Private: protect
exports.updateMyPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      password: await bcrypt.hash(req.body.password, 8),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return next(new APIError(`no user with this ID:${req.params.id}`, 404));
  }

  createAndSendToken(user, 200, res);
});

// @desc     Update My Profile [!password , !role]
// @route    PUT api/v1/users/updateMyProfile
// @access   Private: protect
exports.updateMyProfile = expressAsyncHandler(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new APIError(
        `use this route to change your password: ${process.env.BASE_URL}/api/v1/users/changePassword/${req.params.id}`,
        404
      )
    );
    // delete req.body.password;
  }
  if (req.body.role)
    return next(
      new APIError("Forbidden, updating roles restricted to admins only", 403)
    );
  const { name, email, phone, slug } = req.body;
  const updatedDocument = await User.findOneAndUpdate(
    { _id: req.user.id },
    { name, email, phone, slug },
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

// @desc     Deactivate or delete My Profile
// @route    PUT api/v1/users/deleteME
// @access   Private: protect
exports.deleteMe = expressAsyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate({ _id: req.user._id }, { active: false });
  res.status(204).json({ status: "Success" });
});

// @desc     Reactive My Profile
// @route    PUT api/v1/users/activateME
// @access   Private: protect
exports.activeMe = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { active: true },
    { new: true }
  );
  res.status(200).json({ status: "Success", data: user });
});
