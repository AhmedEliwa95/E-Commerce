const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../../middlewares/validator");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.createUserValidator = [
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
  check("role").optional().isIn(["admin", "user"]),
  check("profileImg").optional(),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("only Egyptian and Saudi numbers are valid"),
  check("profileImg").optional(),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("name length alowed from 3 chars")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("not a valid email")
    .isLowercase()
    .withMessage("email should be lowercase chars only")
    .custom(async (val) => {
      // unhandled rejection error
      const user = await User.findOne({ email: val });
      if (user) throw new Error(`E-mail already in use`);
    }),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.changeUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage(`Current user password is required`),
  check("passwordConfirm")
    .notEmpty()
    .withMessage(`passwordConfirm is required`),
  check("password")
    .notEmpty()
    .withMessage(`password is required`)
    .custom(async (val, { req }) => {
      //1- check if the password equal to the confrim password
      if (val !== req.body.passwordConfirm)
        throw new Error("password and paswword confirm not identical");
      //2- check if the user exist or not
      const user = await User.findById(req.params.id);
      if (!user) throw new Error(`no user with this ID`);

      //3- compare between hashed password stored in the database with the current passsword
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) throw new Error("the password is not correct");

      return true;
    }),

  validatorMiddleware,
];

exports.updateMeValidator = [
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("only Egyptian and Saudi numbers are valid"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("name length alowed from 3 chars")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("not a valid email")
    .isLowercase()
    .withMessage("email should be lowercase chars only")
    .custom(async (val) => {
      // unhandled rejection error
      const user = await User.findOne({ email: val });
      if (user) throw new Error(`E-mail already in use`);
    }),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];
