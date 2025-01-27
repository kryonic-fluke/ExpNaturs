/* eslint-disable */

const express = require('express');
const app = express(); // this function will add bunch of methods to app var
const morgan = require('morgan');
const userRouter = require('./router/userRoutes');
const tourRouter = require('./router/tourRoutes');


// 1) Middleware
if(process.env.NODE_ENV === "development"){
  app.use(morgan('dev')); // gives the info about the request in the console
}


app.use(express.json()); // this is the middleware that can modify the incoming data, it stands between req and res, data from the body(property of a req) is added to it
app.use(express.static(`${__dirname}/public`))
app.use((req, res, next) => {
  // this middleware is applied to each request that comes after it
  console.log('hello from the middleware 😊');
  next(); // if we didn't call the next, the req response cycle will be stuck
});

// the routehandler before middleware sends the response, ending the req res cycle,
// so the next middleware in the stack after that does not get called

// 3) Routes
app.use('/api/v1/tours', tourRouter); // tourRouter is a middleware that will be used for the specified route
// request goes into middleware stack, and matches the specified url, then function will run
app.use('/api/v1/users', userRouter);


module.exports =app