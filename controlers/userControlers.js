/*eslint-disable*/

const catchAsync = require('./utils/catchAsync');
const User =require('../models/usermodel');
const AppError = require('./utils/Apperror');


const filterObj = (obj,...allowedFields)=>{
  const newObj = {}
  
  Object.keys(obj).forEach(el => { 
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj
}
exports.getAllUsers = catchAsync(async(req, res,next) => {
 const   user = await User.find();
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    }, 
  });
  });

  exports.updateMe= catchAsync(async(req,res,next)=>{
    //1) create error if user POSTS password data
     if(req.body.password ||req.body.passwordConfirmation) {
      return next(new AppError('this route is not for password updates.Please use updatePassword', 400)) //bad request
     }

//3) filterred out unwanted fields names that are not allowed to be updated 
    const filterBody = filterObj(req.body,'name','email');
    //3)update user document 

    const updateUser = await User.findByIdAndUpdate(req.user.id,filterBody,{new :true,runValidators:true} )   //new option set to true op that it rreturns updated object 
     
    res.status(200).json({
      status:'success',
      data:{
        user:updateUser
      }
     
    })
  })
  


  exports.deleteMe =catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active:false})

    res.status(204).json({  //204 is for deleted 
      status:'success',
      data:null
    })
  })


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
  