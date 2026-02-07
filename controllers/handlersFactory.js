const fs = require("fs");
const path = require("path");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinaryService = require("../services/cloudinaryService");
const { v4: uuid } = require("uuid");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(
        new ApiError(`Delete failed: Document not found for id: ${id}`, 404),
      );
    }

    // Delete image from Cloudinary if exists
    // Support both new object structure and old potentially?
    // Assuming schema is becoming { url, public_id } or just url?
    // The service handles cleanup if public_id exists.
    if (document.image && document.image.public_id) {
      await cloudinaryService.deleteImage(document.image.public_id);
    }

    await Model.findByIdAndDelete(id);

    res.status(204).json({
      message: `Successfully deleted`,
      data: document,
    });
  });

exports.updateOne = (Model, options = {}) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const oldDocument = await Model.findById(id);
    if (!oldDocument) {
      return next(
        new ApiError(`Update failed : Document not found for id: ${id}`, 404),
      );
    }

    // If a new file is uploaded
    if (req.file) {
      // 1. If we have a buffer (memory storage), upload it
      let uploadResult;

      // If we are coming from 'resizeImage' middleware, the upload might already be done
      // and URL set in req.body.image.
      // BUT 'handlersFactory' is generic.

      // Case A: resizeImage middleware ALREADY processed it.
      // req.uploadedFileMetadata might exist from my previous change in resizeImageMiddleware
      if (req.uploadedFileMetadata) {
        // It's already uploaded. We just need to delete old one if it exists.
        if (oldDocument.image && oldDocument.image.public_id) {
          await cloudinaryService.deleteImage(oldDocument.image.public_id);
        }
        // req.body.image is already set to URL.
        // We might want to ensure we save structure { url, public_id } if the model supports it.
        // For now, let's respect what resizeMiddleware did (set to URL string or whatever).
        // But if we want to save public_id, we should look at req.uploadedFileMetadata
        if (req.uploadedFileMetadata.public_id) {
          req.body.image = {
            url: req.uploadedFileMetadata.url,
            public_id: req.uploadedFileMetadata.public_id,
          };
        }
      }
      // Case B: No resize middleware, just raw upload (req.file present but no metadata).
      else if (req.file.buffer) {
        try {
          const publicId = `ecommerce/${Model.modelName.toLowerCase()}-${uuid()}-${Date.now()}`;
          uploadResult = await cloudinaryService.updateImage(
            oldDocument.image?.public_id, // old public_id
            req.file.buffer, // new buffer
            {
              folder: `ecommerce/${Model.modelName.toLowerCase()}`,
              public_id: publicId,
            },
          );

          req.body.image = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          };
        } catch (err) {
          return next(new ApiError(`Image upload failed: ${err.message}`, 500));
        }
      }
    }

    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) {
      return next(
        new ApiError(`Update failed : Document not found for id: ${id}`, 404),
      );
    }
    res.status(200).json({
      message: "Document updated",
      data: document,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    // Case A: Upload handled by previous middleware (resizeImage)
    if (req.uploadedFileMetadata) {
      if (req.uploadedFileMetadata.public_id) {
        req.body.image = {
          url: req.uploadedFileMetadata.url,
          public_id: req.uploadedFileMetadata.public_id,
        };
      }
    }
    // Case B: Raw upload (buffer) needing handling here
    else if (req.file && req.file.buffer) {
      try {
        const publicId = `ecommerce/${Model.modelName.toLowerCase()}-${uuid()}-${Date.now()}`;
        const uploadResult = await cloudinaryService.uploadStream(
          req.file.buffer,
          {
            folder: `ecommerce/${Model.modelName.toLowerCase()}`,
            public_id: publicId,
          },
        );

        req.body.image = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        };
      } catch (err) {
        return next(new ApiError(`Image upload failed: ${err.message}`, 500));
      }
    }
    // Case C: req.file exists but no buffer? (path) -> This shouldn't happen with memoryStorage,
    // but if we support legacy diskStorage, we might need logic.
    // For now assuming memoryStorage as per plan.

    const newDocument = await Model.create(req.body); // req.body should now contain image field if set

    if (!newDocument) {
      return next(new ApiError("Create failed : newDocument not found", 404));
    }

    res.status(201).json({
      message: "newDocument created",
      data: newDocument,
    });
  });

exports.getOne = (Model, populateOpts) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) build query
    let query = Model.findById(id);
    if (populateOpts) {
      query = query.populate(populateOpts);
    }
    // 2) execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`Document not found for id: ${id}`, 404));
    }

    res.status(200).json({
      message: "success",
      data: document,
    });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    // for subcategories belongs to category
    let filter = {};
    if (req.filterObject) filter = req.filterObject;

    const documentsCounts = await Model.countDocuments();

    const features = new ApiFeatures(
      Model.find(filter), // .populate({ path: "category", select: "name -_id" })
      req.query,
    )
      .filter()
      .sort()
      .search(modelName)
      .limitFields()
      .paginate(documentsCounts); // pass total documents if you want

    const documents = await features.mongooseQuery; // keep your property name
    if (!documents) {
      return next(new ApiError("Categories not found", 404));
    }

    res.status(200).json({
      message: "success",
      count: documents.length,
      pagination: features.paginationResult,
      data: documents,
    });
  });
