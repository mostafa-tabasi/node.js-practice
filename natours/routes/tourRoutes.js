const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("../controllers/authController");

const router = express.Router();

// run checkID only on requests that has ID param in it
// router.param("id", tourController.checkID);

router
  .route("/top-5-tour")
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route("/stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  // first run checkBody middleware before creating a tour
  .post(/*tourController.checkBody,*/ tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
