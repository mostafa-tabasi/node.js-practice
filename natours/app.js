const morgan = require("morgan");
const express = require("express");
const app = express();
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// MIDDLEWARES
// we set these middlewares for all routes
// the middleware we need to read the request's body
app.use(express.json());
// middleware for logging requests and responses (in development only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// we set these two middlewares only for specific routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// when code execution reaches to this point, it means the request wasn't a matched with any of routes until this point.
// because the middlewares will be applied by their order.
// so it means the route isn't handled by devs and need to show a generic response of 404.
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = "fail";
  err.statusCode = 404;

  next(err);
});

// a general error handler middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
