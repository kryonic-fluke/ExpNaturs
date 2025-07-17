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

const sendErrorDev = (err, req, res) => {
  // --- DEVELOPMENT ERROR HANDLER ---

  // --- API Errors (URLs starting with /api) ---
  if (req.originalUrl.startsWith('/api')) {
    // A) For API requests in development: Send detailed JSON error response
    //    (Includes status, error object, message, and stack trace - for debugging)
    return res.status(err.statusCode).json({
      status: err.status,
      error: err, // Full error object (for detailed debugging)
      message: err.message, // Error message
      stack: err.stack, // Stack trace (for pinpointing error location)
    });
  }

  // --- Website Errors (Non-API requests) ---
  // B) For website requests in development: Render a simple error page
  //    Note: In development, we still show the error message on the page for easier debugging.
  console.error('dev ERROR 💥', err);
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong', // Title for the error page
    msg: err.message, // Error message (shown on the error page for development)
    // In production, we would NOT expose the detailed 'err.message' on a public error page
    // to prevent information leakage and security risks.
  });
};

const sendErrorProd = (err, req, res) => {
  // --- API Error Handling ---
 

  if (req.originalUrl.startsWith('/api')) {
    // A) Operational API error: Send client-friendly JSON
    if (err.isOperational) {
      return res.status(err.statusCode).json({ status: err.status, message: err.message });
    }
    // B) Programming API error: Log error, send generic JSON
    console.error('PRODUCTION ERROR 💥', err);
    res.status(500).json({ status: 'error', message: 'Something went very wrong!' });
  }

  // --- Website Error Handling ---
  // A) Operational Website error: Send JSON (or consider error page)
  if (err.isOperational) {
    // console.log(err.message);
   return res.status(err.statusCode).render('error', { title: 'Something went wrong',  msg:err.message });
  }
  // B) Programming Website error: Render generic error page
  console.error('PRODUCTION ERROR 💥', err);
   res.status(err.statusCode).render({ title: "Something went wrong", msg:"Please try again"
  
   });

};

module.exports = (err, req, res, next) => {
  // Set defaults if not already present (e.g., from non-AppError errors)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
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
    sendErrorProd(errorToSend,req, res);
  }
};
