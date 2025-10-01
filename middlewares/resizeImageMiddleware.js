const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");

module.exports.resizeImage = (folderName, prefix = "image") =>
  asyncHandler(async (req, res, next) => {
    if (!req.file) return next();

    const filename = `${prefix}-${uuid()}-${Date.now()}.jpeg`;

    const dir = path.join(__dirname, `../uploads/${folderName}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/${folderName}/${filename}`);

    req.body.image = filename;
    next();
  });
