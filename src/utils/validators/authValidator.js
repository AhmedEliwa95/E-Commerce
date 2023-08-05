const { check } = require("express-validator");
const { default: slugify } = require("slugify");

const validatorMiddleware = require("../../middlewares/validator");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("name length alowed from 3 chars")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required for the user")
    .isEmail()
    .withMessage("not a valid email")
    .isLowercase()
    .withMessage("email should be lowercase chars only")
    .custom(async (val) => {
      // unhandled rejection error
      const user = await User.findOne({ email: val });
      if (user) throw new Error(`E-mail already in use`);
    }),
  check("password")
    .notEmpty()
    .withMessage("user password is required")
    .isStrongPassword()
    .withMessage("Password too weak")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirm Incorrect");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("only Egyptian and Saudi numbers are valid"),
  check("profileImg").optional(),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required for the user")
    .isEmail()
    .withMessage("not a valid email")
    .isLowercase()
    .withMessage("email should be lowercase chars only")
    .custom(async (val) => {
      // unhandled rejection error
      const user = await User.findOne({ email: val });
      if (!user) throw new Error(`Incorrect email or password`);
    }),
  check("password").notEmpty().withMessage("user password is required"),
  //   .custom((val, { req }) => {
  //     if (val !== req.body.passwordConfirm) {
  //       throw new Error("Password Confirm Incorrect");
  //     }
  //     return true;
  //   }),
  validatorMiddleware,
];

exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required for the user")
    .isEmail()
    .withMessage("not a valid email")
    .isLowercase()
    .withMessage("email should be lowercase chars only"),
  check("newPassword")
    .notEmpty()
    .withMessage("user password is required")
    .isStrongPassword()
    .withMessage("week password"),

  validatorMiddleware,
];
