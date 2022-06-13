const Review = require("../models/Review");
const BootCamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(`No review found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: review, success: true });
});

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Not bootcamp found with id ${req.params.bootcampId}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);
  res.status(200).json({ data: review, success: true });
});

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Not Review found with id ${req.params.id}`, 404)
    );
  }
  if (review.user.toString() == req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not Authorized to update"), 401);
  }
  review = await Review.findByIdAndUpdate(req.params, id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ data: review, success: true });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Not Review found with id ${req.params.id}`, 404)
    );
  }
  if (review.user.toString() == req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not Authorized to update"), 401);
  }
  await review.remove();
  res.status(200).json({ data: {}, success: true });
});
