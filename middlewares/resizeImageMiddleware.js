const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const cloudinaryService = require("../services/cloudinaryService");

module.exports.resizeImage = (folderName, prefix = "image") =>
  asyncHandler(async (req, res, next) => {
    if (!req.file) return next();

    const filename = `${prefix}-${uuid()}-${Date.now()}`; // No extension in public_id usually

    // 1. Process image with Sharp
    const buffer = await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    // 2. Upload to Cloudinary using Service
    // Note: In a real prod app, you might want to switch based on NODE_ENV,
    // but for this refactor we are standardizing on Cloudinary as requested.

    try {
      const uploadResult = await cloudinaryService.uploadStream(buffer, {
        folder: `ecommerce/${folderName}`, // Organized folder structure
        public_id: filename,
        resource_type: "image",
      });

      // 3. Save result to body for controller
      // Consistent format: { url: string, public_id: string }
      // Adapting to existing schema if it expects a string, but recommended is object.
      // For now, let's stick to what the controller might expect but prepare for object.

      // existing controllers seemed to expect just filenameString or simple URL.
      // Let's attach full object to `req.rawUploadedImage` and mapped field to `req.body`

      req.body[folderName === "users" ? "profileImage" : "image"] =
        uploadResult.secure_url;
      // Also attach public_id if the model supports it.
      // We'll handle Model schema updates in a separate step/check,
      // but for now let's attach metadata to req if needed later.
      req.uploadedFileMetadata = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };

      next();
    } catch (error) {
      console.error("❌ Resize Middleware Error:", error);
      // Assuming ApiError is defined or imported elsewhere in the project
      // If not, you might need to adjust this line to a standard Error or import ApiError.
      return next(new ApiError(`Image upload failed: ${error.message}`, 500));
    }
  });
