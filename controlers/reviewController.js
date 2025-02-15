/* eslint-disable */
const Review =require('./../models/reviewModel')
const APIFeatures = require('./utils/ApiFeat');
const AppError = require('./utils/Apperror');
const factory  = require('./handlerFactory')

const catchAsync = require('./utils/catchAsync');

exports.getAllReviews = factory.getAllOne(Review)

      //to get all the reviews of specified tourId

  


exports.setTourUserIds = (req,res,next) =>{
  //allow nested routes
  
  if(!req.body.tour) req.body.tour=  req.params.tourId;
  if(!req.body.user) req.body.user=  req.user.id;
  next();
} 

exports.createReview =factory.createOne(Review)

exports.deleteReview = factory.deletOne(Review)

exports.UpdateReview = factory.updateOne(Review)
exports.getReview = factory.getOne(Review)