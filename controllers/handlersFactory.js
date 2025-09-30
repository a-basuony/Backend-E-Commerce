const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(
        new ApiError(`Delete failed : SubCategory not found for id: ${id}`, 404)
      );
    }
    res.status(200).json({
      message: `Successfully deleted`,
      data: document,
    });
  });
// ================== example ==================
// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const product = await Product.findByIdAndDelete(id);
//   if (!product) {
//     return next(
//       new ApiError(`Delete failed : Product not found for id: ${id}`, 404)
//     );
//   }

//   res.status(200).json({
//     message: "Product deleted",
//     data: product,
//   });
// });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) {
      return next(
        new ApiError(`Update failed : Document not found for id: ${id}`, 404)
      );
    }
    res.status(200).json({
      message: "Document updated",
      data: document,
    });
  });

// ================== example ==================
// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

//   if (!product) {
//     return next(
//       new ApiError(`Update failed : Product not found for id: ${id}`, 404)
//     );
//   }

//   res.status(200).json({
//     message: "Product updated",
//     data: product,
//   });
// });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const newDocument = await Model.create(req.body);
    if (!newDocument) {
      return next(new ApiError("Create failed : newDocument not found", 404));
    }

    res.status(201).json({
      message: "newDocument created",
      data: newDocument,
    });
  });

// ================== example ==================
// exports.createSubCategory = asyncHandler(async (req, res, next) => {
//   const { name, category } = req.body;
//   const subCategory = await SubCategory.create({
//     name,
//     slug: slugify(name),
//     category,
//   });
//   if (!subCategory) {
//     return next(new ApiError("Create failed : SubCategory not found", 404));
//   }

//   res.status(201).json({ message: "SubCategory created", data: subCategory });
// });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`Document not found for id: ${id}`, 404));
    }

    res.status(200).json({
      message: "success",
      data: document,
    });
  });
// ================== example ==================
// exports.getSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const subCategory = await SubCategory.findById(id);
//   if (!subCategory) {
//     return next(new ApiError(`SubCategory not found for id: ${id}`, 404));
//   }
//   res.status(200).json({ message: "success", data: subCategory });
// });
