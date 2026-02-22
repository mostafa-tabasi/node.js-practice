const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have name"],
      unique: true,
      trim: true,
      minLength: [5, "A tour name must have more or equal then 5 characters"],
      maxLength: [40, "A tour name must have less or equal then 40 characters"],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // val refers to price discount value
          // "this" only points to current doc on NEW document creation
          // so this validation doesn't work on update operator
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // to remove this field from response when selecting
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// these type of properties are not part of the database
// they're just gonna be in the result
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() operator and not .update() for example
// we can have multiple pre or post middleware
// ("this" ketword inside this function refers to the document)
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// runs after .save() and .create() operator
tourSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE: runs before any query that start with "find"
// ("this" ketword inside this function refers to the query)
tourSchema.pre(/^find/, function (next) {
  // we're gonna hide all the secret tours from the query
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGTION MIDDLEWARE ("this" ketword inside this function refers to the aggregation)
tourSchema.pre("aggregate", function (next) {
  // to add an object in the beginning of an array we use .unshift()
  // to add an object in the end of an array we use .shift()
  // here we want to add another $match aggregate to the pipeline to exclude the secret tour
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
