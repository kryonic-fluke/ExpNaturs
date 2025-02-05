/*eslint-disable*/

const AppError = require('./utils/Apperror');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400); //so we converted a mongoose error in nicely formated operational error
};

const handleDuplicateFeildDB = (err)=>{
  
  const errors = Object.values(err.errors).map(el => el.message);
  console.log(errors);
  
  // Create a comprehensive error message
  const message = `Invalid input data. ${errors.join('. ')}`;
  
  // Return a new operational error with 400 status (Bad Request)
  return new AppError(message, 400);
}

const handleValidationErrorDB =(err)=>{
  const errors = Object.keys(err.errors).map(key => {
    // Directly access the message property
    return err.errors[key].message;
  });
  console.log(errors);
  

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}
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

  err.statusCode = err.statusCode || 500; // Default to 500 if statusCode isn't set
  err.status = err.status || 'error'; // Default to 'error' if status isn't set
  if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err)); // Creating a shallow copy of the err object
    error.name = err.name;
    error.message = err.message;
    error.errors = err.errors;

    console.log(error);
    
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error); // Passes the error that Mongoose created to this function
      // The function should return a new error object with the operation set to true
    }

    if(error.code===11000) error=handleDuplicateFeildDB(error)

      if(error.name==='ValidationError') error=handleValidationErrorDB(error,res)
    sendErrorProduction(error, res); // Sending the error response in production
  }
};
