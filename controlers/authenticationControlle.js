/*eslint-disable*/

const User=require('./../models/usermodel');
const catchasync= require('./utils/catchAsync');
exports.signup = catchasync(async (req, res, next) => {
  //   console.log('request is hit');
  // console.log(req.body);
  
    const newUser = await User.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  });
