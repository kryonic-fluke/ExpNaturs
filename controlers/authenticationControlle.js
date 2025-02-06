/*eslint-disable*/
const jwt = require('jsonwebtoken')
const User=require('./../models/usermodel');

const catchasync= require('./utils/catchAsync');
exports.signup = catchasync(async (req, res, next) => {
  //   console.log('request is hit');
  // console.log(req.body);
 
  // const newUser = await User.create(req.body)    //we create user with all the data that is coming from the body , the problem here is that any one can specify their role as Admin
    const newUser = await User.create({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      passwordConfirmation:req.body.passwordConfirmation
    });      

    //inside the sign is the payload
    const token= jwt.sign({id:newUser._id}, process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_EXPIRES_IN         //THIS IS A OPTION
    }) // we have th epayload, secret and the header is created automatically 
    
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  });
