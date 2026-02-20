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
    // FILTERING SOLUTION #1
    // 1A) Filtering
    // making a copy of the request query
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    // remove excluded fields from the query
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    // we need to add a $ sign before these 4 operators (operators in mongodb format)
    // gte => greater than or equal
    // gt => greater than
    // lte => less than or equal
    // lt => less than
    // we added "\b" to both side so the exact operator word will be considered as a match
    // we added "g" at the end so for every match we add the $ sign, not only the first match

    // an example for a query with duration greater than or equal 5 will be like:
    // 127.0.0.1:3000/api/v1/tours?duration[gte]=5
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      // need to replace "," with a blank space " " in the sort query
      // for the cases that we have more than one field for sorting

      // an example will be like:
      // 127.0.0.1:3000/api/v1/tours?sort=-price,-ratingsAverage
      // in this example, the result will be sorted first based on price decending,
      // and then ratingsAverage decending
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }
    // in case user didn't specify any sorting, apply a default sorting based on "createdAt" field
    else {
      query = query.sort("-createdAt");
    }

    // 3) Field limiting (when user only wants especific fields in the response)
    if (req.query.fields) {
      // an example will be like:
      // 127.0.0.1:3000/api/v1/tours?fields=name,price
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }
    // in case user didn't spedify any fields, apply a default limiting by not showing the "__v" field
    else {
      query = query.select("-__v");
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist");
    }

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
