const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// The remote database currently not working
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  // .connect(DB, {
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("Database connection successful!");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// handling promiss rejections out of express
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    // 0 for closing with success and 1 for error
    process.exit(1);
  });
});
