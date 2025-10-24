const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const cloudinary = require("../config/cloudinary");

module.exports.resizeImage = (folderName, prefix = "image") =>
  asyncHandler(async (req, res, next) => {
    if (!req.file) return next();

    const filename = `${prefix}-${uuid()}-${Date.now()}.jpeg`;

    // ✅ Resize image once
    const buffer = await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    // ✅ If local (development): save image to /public/uploads
    if (process.env.NODE_ENV === "development") {
      const dir = path.join(__dirname, `../public/uploads/${folderName}`);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      await sharp(buffer).toFile(path.join(dir, filename));

      // Save local path (useful for local testing)
      req.body[folderName === "users" ? "profileImage" : "image"] = filename;
      return next();
    }

    // ✅ If production: upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `uploads/${folderName}`,
          public_id: filename.replace(".jpeg", ""),
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Save Cloudinary URL
    req.body[folderName === "users" ? "profileImage" : "image"] =
      uploadResult.secure_url;

    next();
  });
