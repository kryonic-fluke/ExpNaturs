/* eslint-disable */
const Review =require('./../models/reviewModel')
const APIFeatures = require('./utils/ApiFeat');
const AppError = require('./utils/Apperror');
const factory  = require('./handlerFactory')

const catchAsync = require('./utils/catchAsync');


exports.getAllReviews   =catchAsync(async(req, res,next)=>{
    let filter = {}
    if(req.params.tourId) filter = {tour:req.params.tourId};    //to get all the reviews of specified tourId

  const  reviews  = await Review.find(filter);

  if(!reviews){
    return next(new AppError('No rewiew found', 404))
  }

  res.status(200).json({
    status: 'success',
    results:reviews.length,
    data: {
      reviews,
    },
  });
})

exports.createReview = catchAsync(async(req,res,next)=>{
    //allow nested routes
  if(!req.body.tour) req.body.tour=  req.params.tourId;
  if(!req.body.user) req.body.user=  req.user.id;
    const newReview = await Review.create(req.body);
     
    res.status(201).json({
        status:"success",
        data:{
         review:newReview
        }
    })

    
})

exports.deleteReview = factory.deletOne(Review)