const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // we use this way of user creation instead of "User.create(req.body)" so that
  // we only get and store the fields we need instead of whatever user sends in request body
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists & password is correct
  //                                               because we set "select" property to false for password field,
  //                                               by default "password" field is gone from selecting,
  //                                               so we need to explicitly select the password and add it to document
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) Sign and send the token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
