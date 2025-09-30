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
