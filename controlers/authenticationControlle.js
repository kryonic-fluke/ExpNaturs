/*eslint-disable*/
const jwt = require('jsonwebtoken');
const User = require('./../models/usermodel');
const AppError = require('./utils/Apperror');
const catchasync = require('./utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, //THIS IS A OPTION
  });
};
exports.signup = catchasync(async (req, res, next) => {
  //   console.log('request is hit');
  // console.log(req.body);

  // const newUser = await User.create(req.body)    //we create user with all the data that is coming from the body , the problem here is that any one can specify their role as Admin
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  }); //inside the sign is the payload
  // const token= jwt.sign({id:newUser._id}, process.env.JWT_SECRET,{
  //   expiresIn:process.env.JWT_EXPIRES_IN         //THIS IS A OPTION
  // }) // we have th epayload, secret and the header is created automatically

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchasync(async (req, res, next) => {
  const { email, password } = req.body; // 1) Check if email and password actually exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400)); // Correct: return next()
  } // 2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 404)); // corrected : user.password
  console.log(user); // 3) If everything is okay, send toke n to client

  console.log('Authentication successful'); // Log to indicate success
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
