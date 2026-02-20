// const fs = require("fs");
const Tour = require("./../models/tourModel");

/*
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/tours-simple.json`),
);
*/

/*
// param middleware to check ID availability on requests that has ID param
exports.checkID = (req, res, next, val) => {
  console.log(`Tour ID is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};
*/

/*
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};
*/

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // making a copy of the request query
    // FILTERING SOLUTION #1
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    // remove excluded fields from the query
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = Tour.find(queryObj);

    /*
    // FILTERING SOLUTION #2
    const query = Tour.find()
      .where("duration")
      .equals(5)
      .where("difficulty")
      .equals("easy");
    */

    // EXECUTE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
