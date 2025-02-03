/*eslint-disable*/

module.exports=(err, req, res, next) =>{
    // console.log(err.stack);  //stack shows where error happened 
     
    err.statusCode = err.statusCode || 500; // Default to 500 if statusCode isn't set
    err.status = err.status || 'error'; // Default to 'error' if status isn't set
  
    res.status(err.statusCode).json({ // Fixed typo here
      status: err.status,
      message: err.message,
    })
}