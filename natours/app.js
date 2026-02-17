const morgan = require("morgan");
const express = require("express");
const app = express();
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// 1) MIDDLEWARES
// we set these middlewares for all routes
// the middleware we need to read the request's body
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
// we set these two middlewares only for specific routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// 4) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
