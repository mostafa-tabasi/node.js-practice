const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

// run checkID only on requests that has ID param in it
router.param("id", tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// router.route("/").post(tourController.checkBody)

router
  .route("/")
  .get(tourController.getAllTours)
  // first run checkBody middleware before creating a tour
  .post(tourController.checkBody, tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
