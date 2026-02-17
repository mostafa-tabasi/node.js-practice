const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

// run checkID only on requests that has ID param in it
router.param("id", tourController.checkID);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
