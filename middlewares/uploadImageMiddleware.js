const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Not an image! Please upload only images", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

// 2. Memory Storage

// module.exports.uploadSingleImage = (fieldName) => {
//   const multerStorage = multer.memoryStorage();

//   const multerFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image")) {
//       cb(null, true);
//     } else {
//       cb(new ApiError("Not an image! Please upload only images", 400), false);
//     }
//   };

//   const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

//   return upload.single(fieldName);
// };

// 1. Disk Storage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, "../uploads/categories");

//     // if directory doesn't exist
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuid()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// 2. Memory Storage
