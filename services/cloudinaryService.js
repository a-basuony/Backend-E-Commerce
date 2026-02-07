const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Uploads a file buffer to Cloudinary using upload_stream.
 * @param {Buffer} buffer - The file buffer.
 * @param {Object} options - Cloudinary upload options (folder, public_id, etc.).
 * @returns {Promise<Object>} - The Cloudinary upload result.
 */
exports.uploadStream = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Deletes an image from Cloudinary by public_id.
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<Object>} - The Cloudinary destroy result.
 */
exports.deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Cloudinary Delete Error (public_id: ${publicId}):`, error);
    // We explicitly decide NOT to throw here to prevent blocking main flow if cleanup fails,
    // but we log it.
    return null;
  }
};

/**
 * Updates an image (Delete old -> Upload new).
 * @param {string} oldPublicId - The public ID of the old image.
 * @param {Buffer} newBuffer - The new file buffer.
 * @param {Object} uploadOptions - Options for the new upload.
 * @returns {Promise<Object>} - The new Cloudinary upload result.
 */
exports.updateImage = async (oldPublicId, newBuffer, uploadOptions) => {
  if (oldPublicId) {
    await exports.deleteImage(oldPublicId);
  }
  return exports.uploadStream(newBuffer, uploadOptions);
};
