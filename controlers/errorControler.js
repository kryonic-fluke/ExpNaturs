/* eslint-disable */
const AppError = require('./utils/Apperror');

// --- Handler functions remain the same ---
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  // Extract value from the error message for better feedback
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => 
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => 
  new AppError('Your token has expired! Please log in again.', 401);
// ---------------------------------------


const sendErrorDev = (err, res) => {
  // Log the full error in development
  console.error('DEV ERROR 💥', err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => { 
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  // B) Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error for developer
    console.error('PRODUCTION ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!', // More user-friendly message
    });
  }
};


module.exports = (err, req, res, next) => {
  // Set defaults if not already present (e.g., from non-AppError errors)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);

  } else if (process.env.NODE_ENV === 'production') {
    // Create a variable to hold the potentially transformed error
    // IMPORTANT: Work with the original 'err' or create NEW AppErrors, avoid flawed cloning.
    let errorToSend = err;

    // Check for specific Mongoose/JWT errors and transform them into operational AppErrors
    if (err.name === 'CastError') errorToSend = handleCastErrorDB(err);
    if (err.code === 11000) errorToSend = handleDuplicateFieldDB(err); // Note: errmsg format might vary
    if (err.name === 'ValidationError') errorToSend = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') errorToSend = handleJWTError();
    if (err.name === 'TokenExpiredError') errorToSend = handleJWTExpiredError();

    // After potential transformation, send the response based on operational status
    sendErrorProd(errorToSend, res);
  }
};