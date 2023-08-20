const asyncHandler = require("express-async-handler");
const APIError = require("./apiError");
const APIFeatures = require("./APIFeature");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findOneAndDelete({ _id: id });

    if (!document) {
      next(new APIError(`No Document with this ID: ${id}`, 404));
    }

    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const updatedDocument = await Model.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    await updatedDocument.save();

    if (!updatedDocument) {
      return next(
        new APIError(`No Document with this ID: ${req.params.id}`, 404)
      );
    }

    res.status(200).send({ data: updatedDocument });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = new Model(req.body);
    await document.save();
    res.status(201).send({ data: document });
  });

exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = await Model.findById(req.params.id);

    if (populateOptions) {
      query = await query.populate({ path: populateOptions });
    }
    if (!query) {
      return next(new APIError(`No document with this ID: ${req.params.id}`));
    }

    res.status(200).send({ data: query });
  });

exports.getAll = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    const countDocs = await Model.countDocuments();
    const apiFeatures = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .paginate(countDocs)
      .sort()
      .fieldLimits()
      .search(modelName);

    const { mongooseQuery, paginationResult } = apiFeatures;
    const data = await mongooseQuery;
    res.status(200).json({
      results: data.length,
      paginationResult,
      data,
    });
  });
