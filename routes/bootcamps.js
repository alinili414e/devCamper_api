const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootCampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");
const courseRouter = require("./courses");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);

router.route("/:id/photo").put(protect, bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
