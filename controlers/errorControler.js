/*eslint-disable*/

const AppError = require('./utils/Apperror');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400); //so we converted a mongoose error in nicely formated operational error
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      //user facing
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error💥', err);

    res.status(500).json({
      status: 'error',
      message: "something really got fkd, we're looking into it 😅",
    });
  }
};
module.exports = (err, req, res, next) => {
  // console.log(err.stack);  //stack shows where error happened
  console.log(process.env.NODE_ENV);

  err.statusCode = err.statusCode || 500; // Default to 500 if statusCode isn't set
  err.status = err.status || 'error'; // Default to 'error' if status isn't set
  if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err)); // Creating a shallow copy of the err object

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error); // Passes the error that Mongoose created to this function
      // The function should return a new error object with the operation set to true
    }

    sendErrorProduction(error, res); // Sending the error response in production
  }
};
