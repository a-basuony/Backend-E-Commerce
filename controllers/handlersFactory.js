const fs = require("fs");
const path = require("path");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("../config/cloudinary");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(
        new ApiError(`Delete failed: Document not found for id: ${id}`, 404)
      );
    }

    // Delete image from Cloudinary if exists
    if (document.image && document.image.public_id) {
      await cloudinary.uploader.destroy(document.image.public_id);
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
        new ApiError(`Update failed : Document not found for id: ${id}`, 404)
      );
    }

    if (
      req.file &&
      oldDocument.image &&
      process.env.NODE_ENV === "development"
    ) {
      const folder = options.imageFolder || ""; // folder name (e.g., "categories", "products", "brands".)
      const oldImagePath = path.join(
        __dirname,
        `../uploads/${folder}/${oldDocument.image}`
      ); // old image path
      fs.unlink(oldImagePath, (err) => {
        if (err) console.log("⚠️ Failed to delete old image:", err.message);
      });
    }

    // If a new file is uploaded, replace the old Cloudinary image
    if (req.file) {
      if (oldDocument.image && oldDocument.image.public_id) {
        await cloudinary.uploader.destroy(oldDocument.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `ecommerce/${Model.modelName.toLowerCase()}`,
      });

      req.body.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) {
      return next(
        new ApiError(`Update failed : Document not found for id: ${id}`, 404)
      );
    }
    // document.save();
    res.status(200).json({
      message: "Document updated",
      data: document,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    let imageData = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `ecommerce/${Model.modelName.toLowerCase()}`,
      });

      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const newDocument = await Model.create({
      ...req.body,
      image: imageData,
    });
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
      req.query
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
