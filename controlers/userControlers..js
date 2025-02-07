/*eslint-disable*/
const catchAsync = require('./utils/catchAsync')
const User =require('./../models/usermodel')
exports.getAllUsers = catchAsync(async(req, res,next) => {
 const   user = await User.find();
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: User.length,
    data: {
      tours,
    },
  });
  });
  
  exports.createUsers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  };
  
  exports.getAuser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  };
  
  exports.UpdateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  };
  
  exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined',
    });
  };
  