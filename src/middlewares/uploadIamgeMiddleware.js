const multer = require("multer");

const APIError = require("../utils/apiError");

// DiskStorage Engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "src/uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     // category-${id}-Date.now.extention
//     const mime = file.mimetype.split("/")[1];
//     const id = uuidv4();
//     const name = `category-${id}-${Date.now()}.${mime}`;

//     cb(null, name);
//   },
// });

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new APIError("Only images allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
