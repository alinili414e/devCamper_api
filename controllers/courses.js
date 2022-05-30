const Course = require("../models/Course");
const BootCamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc      Get Courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/courses/:bootcampId/courses
// @access    Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(`No Course with if of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({ success: true, data: course });
});

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await BootCamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with if of ${req.params.bootcampId}`),
      404
    );
  }
  const course = await Course.create(req.body);
  res.status(200).json({ success: true, data: course });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course with if of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ success: true, data: course });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course with if of ${req.params.id}`),
      404
    );
  }
  await course.remove();
  res.status(200).json({ success: true, data: {} });
});
