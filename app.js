/* eslint-disable */

const express = require('express');
const app = express(); // this function will add bunch of methods to app var
const morgan = require('morgan');
const AppError = require('./controlers/utils/Apperror')
const globalErrorHandler  =require('./controlers/errorControler')
const userRouter = require('./router/userRoutes');
const tourRouter = require('./router/tourRoutes');
const helmet = require('helmet')
const rateLimit  = require('express-rate-limit');
// 1) GLOBAL Middleware, development loging
if(process.env.NODE_ENV === "development"){
  app.use(morgan('dev')); // gives the info about the request in the console
}
//set security http headers
app.use(helmet())
 
//limit request from same api 
const limiter = rateLimit({    //allows 100 request form the same ip  , helps prevent the app from getting attacked by brute force  
  max:3,
  windowMs:60*60*1000,    
  message:'Too many request from this Ip , please try again later'
})

app.use('/api',limiter)     //affects all the route that has api
//body parser, reading data from the body into req.body
app.use(express.json({
  limit:'10kb'
})); // this is the middleware that can modify the incoming data, it stands between req and res, data from the body(property of a req) is added to it

//serving static file 
app.use(express.static(`${__dirname}/public`))

//testing middleware 
app.use((req,res,next)=>{
  req.requestTime  =new Date().toISOString();
  // console.log(req.headers);
  next()
})
// app.use((req, res, next) => {
//   // this middleware is applied to each request that comes after  it
//   console.log('hello from the middleware 😊');
//   next(); // if we didn't call the next, the req response cycle will be stuck
// });

// the routehandler before middleware sends the response, ending the req res cycle,
// so the next middleware in the stack after that does not get called

// 3) Routes
app.use('/api/v1/tours', tourRouter); // tourRouter is a middleware that will be used for the specified route
// request goes into middleware stack, and matches the specified url, then function will run
app.use('/api/v1/users', userRouter);

//if we able to reach this point , indicates that , no valid route is called (middleware cycle is not finished)
app.all('*',((req,res,next)=>{ //all will run for all the verbs in the  http methods
  next(new AppError(`Can't find ${req.originalUrl} on this server`,404))



   // const err=new Error(`Can't find ${req.originalUrl} on the server`);
  // err.status = 'fail';  //we can define status, and status code property to err object
  // err.statusCode = 404;
  // next(err);  //passing err object to the next method , restricts calling all the middleware next in the stack , and call middleware handler
}))              


//error handleing midddleware from express , takes 4 args 
app.use(globalErrorHandler);
module.exports =app