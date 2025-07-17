/*eslint-disable*/
const { promisify } = require('util');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('./../models/usermodel');
const crypto = require('crypto');
const AppError = require('./utils/Apperror');
const sendEmail = require('./utils/email');
const bcrypt = require('bcryptjs');
const changedpasswordAfter = require('./../models/usermodel');
const catchasync = require('./utils/catchAsync');
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, //THIS IS A OPTION
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ), //CONVERTING TO MILLISECONDS
    // secure:true , //cookie will only be sent in an encrypted connection
    httpOnly: true, // this makes it so that cookie can not be accessed and modified anyhwere in the browser , preventing cross side scripting attacks
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  //note one cookie with same name will overirde the already present cookie

  res.cookie('jwt', token, cookieOptions); //removed password from the output while creating a user
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  }); //inside the sign is the payload
  // const token= jwt.sign({id:newUser._id}, process.env.JWT_SECRET,{
  //   expiresIn:process.env.JWT_EXPIRES_IN         //THIS IS A OPTION
  // }) // we have th epayload, secret and the header is created automatically
  createSendToken(newUser, 201, res);
});

exports.login = catchasync(async (req, res, next) => {
  const { email, password } = req.body; // 1) Check if email and password actually exist
  console.log('request came', email, password);

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400)); // Correct: return next()
  } // 2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new AppError('user not found'));
  if (!(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401)); // corrected : user.password
  // 3) If everything is okay, send toke n to client

  console.log('Authentication successful'); // Log to indicate success
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', { 
    expires: new Date(0),         
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.isLoggedin = async function (req, res, next) {
  //only for rendered pages

  if (req.cookies.jwt) {
    //this verifies the token
    try{
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET,
    );
    //chk if the user still exits
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }
    //ckh if the  user changed their password


if (currentUser && currentUser.changedpasswordAfter(decoded.iat)) { 
  return next(
    new AppError('User recently changed password! Please login again.', 401),
  );
}
    res.locals.user = currentUser;
    return next();
  }
  catch(err){
    return next();
  }
}
next();
};

exports.protects = catchasync(async function (req, res, next) {
  //1)getting token and check of it's there

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError('You are not logged in ,pls login to get access', 401),
    ); //401 is unautharized
  //2)Verification  token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3)Chk if user still exists  , for cases if user deleted itself , or if for any reason user changed its password after the token has been issued

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }
  //4 chk if user change password after token was issued
  if (currentUser.changedpasswordAfter(decoded.iat)) {
    return next(
      new AppError('user recently changed password!Please login again.', 401),
    );
  }
  // after all this auth user will get the access to the protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      // Corrected: roles.includes()
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403,
        ),
      ); // forbidden
    }
    next();
  };
};

exports.forgotPassword = catchasync(async (req, res, next) => {
  // 1) get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); //this line will deactivate all the validators in the schema

  // 3) Send it to the user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`; // Corrected URL
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request', // More appropriate subject
      message: message, // Pass the message with the URL
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false }); // Still save to reset token/expiry on error

    return next(new AppError('There was an error sending the email.', 500));
  }
});

exports.resetPassword = catchasync(async (req, res, next) => {
  //1)get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex'); //encrypting the token sent to params

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }); //finding the user based on the toeken, and for which token is not expired

  //2)if token has not expired ,and there is user, set the new passsword

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //3 Update the changedpasswordAt property for the current user

  //4) log the user in, send JWT

  createSendToken(user, 200, res);
});

exports.updatePassword = catchasync(async (req, res, next) => {
  //1) get user from the collection

  const user = await User.findById(req.user.id).select('+password'); //
  //2)check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('enterted password was incorrect', 401));

  //3)if so, update password
  try {
    user.password = req.body.password;
    user.passwordConfirmation = req.body.passwordConfirmation;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' }); // Success response
  } catch (error) {
    console.error('Error updating password:', error); // Log the error for debugging
    return new AppError(
      'Error updating password. Please try again later.',
      500,
    ); // Generic error message
  }
  //4) log the user in , send jwt

  createSendToken(user, 200, res);
});
