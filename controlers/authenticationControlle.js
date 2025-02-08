/*eslint-disable*/
const { promisify } = require('util'); 
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('./../models/usermodel');
const AppError = require('./utils/Apperror');
const changedpasswordAfter = require('./../models/usermodel')
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
    passwordChangedAt:req.body.passwordChangedAt 
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
  // 3) If everything is okay, send toke n to client

  console.log('Authentication successful'); // Log to indicate success
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});


exports.protects = catchasync(async function(req,res,next){
  //1)getting token and check of it's there 
  let token;
  
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
     token  =req.headers.authorization.split(' ')[1];
      
    }
    if(!token) return next(new AppError('You are not logged in ,pls login to get access',401)) //401 is unautharized 
  //2)Verification  token 
   const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET,);

  //3)Chk if user still exists  , for cases if user deleted itself , or if for any reason user changed its password after the token has been issued
    
 const currentUser = await User.findById(decoded.id)
 if(!currentUser){
  return next(new AppError('The user belonging to this token does no longer exist.', 401))
 }
  //4 chk if user change password after token was issued 
 if(currentUser.changedpasswordAfter(decoded.iat)) {
  return next(new AppError('user recently changed password!Please login again.',401)) 
  }

  // after all this auth user will get the access to the protected route 
  req.user=currentUser;
  next();
})