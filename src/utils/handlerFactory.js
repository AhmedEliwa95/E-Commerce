const asyncHandler = require("express-async-handler");
const APIError = require("./apiError");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findOneAndDelete({ _id: id });

    if (!document) {
      next(new APIError(`No Document with this ID: ${id}`, 404));
    }

    res.status(204).send();
  });
