const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
// const APIError = require("../apiError");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID"),
  validatorMiddleware, // instead of calling it inside the route to make the route cleaner
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("name length alowed from 3 to 100 chars"),
  check("description")
    .notEmpty()
    .withMessage("Product Description Required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Decription length between 20 to 2000 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Product Quantity is required")
    .isNumeric()
    .withMessage("Product quantity must to be a Number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must to be a Number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must to be a Number")
    .isLength({ max: 32 })
    .withMessage("Price Length must not exceed 32 digit"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a Number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must to be an Array of Colors"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must to be an Array of strings"),
  check("category")
    .notEmpty()
    .withMessage("Product category should be required")
    .isMongoId()
    .withMessage("Invalid CategoryId for this product")
    .custom(async (value) => {
      const categoryExist = await Category.findById(value);
      if (!categoryExist) {
        throw new Error(`No Category with this ID: ${value}`);
      }
    }),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategoryId for this product")
    .custom(
      (
        subCategoriesIds /// to check the existance of these subCategories
      ) =>
        SubCategory.find({
          _id: { $exists: true, $in: subCategoriesIds },
        }).then((result) => {
          // console.log({ result }); // Array result of valid IDs
          if (result.length < 1 || result.length !== subCategoriesIds.length) {
            return Promise.reject(
              new Error(`Invalid subCategoriesIds: ${subCategoriesIds}`)
            );
          }
        })
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIdsInDB = [];

          subCategories.forEach((subCategory) =>
            subCategoriesIdsInDB.push(subCategory._id.toString())
          );

          if (!val.every((v) => subCategoriesIdsInDB.includes(v))) {
            return Promise.reject(
              new Error(
                `Invalid subCategories which not belong to the right parent Category`
              )
            );
          }
        }
      )
    ),
  // .custom(async (val, { req }) => { /// it's working and I don't know how
  //   const subCategoriesOfCategory = await SubCategory.find({
  //     category: req.body.category,
  //   });
  //   console.log(subCategoriesOfCategory.toString());
  //   val.forEach((element) => {
  //     if (!subCategoriesOfCategory.toString().includes(element)) {
  //       // console.log(subCategoriesOfCategory.includes(element));
  //       throw new Error(`SubCategoriesIds not belong to the parent Category`);
  //     }
  //   });
  // }),
  // .custom((val, { req }) =>
  //   SubCategory.find({ category: req.body.category }).then(
  //     (subCategoriesOfCategory) => {
  //       val.forEach((element) => {
  //         if (!subCategoriesOfCategory.includes(element)) {
  //           return Promise.reject(
  //             new Error(`SubCategoriesIds not belong to the parent Category`)
  //           );
  //         }
  //       });
  //     }
  //   )
  // )
  // .custom((arr) => {
  //   arr.forEach(async (element) => {
  //     const subCategory = await SubCategory.findById(element);
  //     // console.log(subCategory);
  //     if (!subCategory) {
  //       return new APIError(
  //         `No SubCategory form Throw with this ID: ${element}`,
  //         404
  //       );
  //       // throw new Error(`No SubCategory with this ID: ${element}`);
  //     }
  //   });
  // })
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brandId for this product"),
  check("ratingsAverage")
    .isNumeric()
    .optional()
    .isLength({ min: 1, max: 5 })
    .withMessage("Product ratingsAverage should between 1 to 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsQuantity should be Numeric"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID"),
  validatorMiddleware,
];
