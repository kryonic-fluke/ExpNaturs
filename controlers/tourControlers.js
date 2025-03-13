/* eslint-disable */
const Tour = require('./../models/tourmodel');
const catchasync = require('./utils/catchAsync');
const APIFeatures = require('./utils/ApiFeat');
const AppError = require('./utils/Apperror');
const factory  = require('./handlerFactory');
const catchAsync = require('./utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAllOne(Tour)
// catchasync(async (req, res, next) => {
//   //Execute the query
//   console.log('request hit ');

//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;
  
//   //SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

exports.getATour = factory.getOne(Tour,{path:'tourReviews'})


exports.CreateNewTour = factory.createOne(Tour)
// catchasync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tours: newTour,
//     },
//   });
// });

exports.UpdateTour = factory.updateOne(Tour)
//  catchasync(async (req, res) => {
  // const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  // if(!tour){
  //   return next(new AppError('No tour found with that Id', 404))
  // }
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
// });


exports.DeleteTour  =factory.deletOne(Tour);

// exports.DeleteTour = catchasync(async (req, res) => {
//  const tour= await Tour.findByIdAndDelete(req.params.id);
//   if(!tour){
//     return next(new AppError('No tour found with that Id', 404))
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.getTourStats = catchasync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        averageRatnig: { $avg: '$ratingsAverage' },
        averageprice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchasync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tour: { $push: '$name' }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourStart: -1
      }
    },
    {
      $limit: 6
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
// /tours-within/:distance/center/:latlng/unit/:unit
exports.getToursWithin =catchAsync( async (req,res)=>{  
 const  {distance,latlng,unit}=req.params;
const [lat,lng]= latlng.split(',');
const radius =unit ==='mi' ?distance /3963.2:distance /6378.1; 

if(!lat || !lng){
  next(new AppError('plese provide latitude and longitiude in the format lat, lng.',400))

}


const tours =await  Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}});

res.status(200).json({
  status:'success',
  results:tours.length,  
  data:{ 
    data:tours
  }
})

})

exports.getDistances=catchAsync(async(req,res,next)=>{
  const  {latlng,unit}=req.params;
  const [lat,lng]= latlng.split(',');

  const multiplier =  'mi'? 0.00062137 : 0.001;
  if(!lat || !lng){
    next(new AppError('plese provide latitude and longitiude in the format lat, lng.',400))
  }
  const distance  =await Tour.aggregate([
    {
      $geoNear:{
        near:{
          type:'Point',
          coordinates:[lng*1,lat*1]
        },
        distanceField:'distance',
        distanceMultiplier:multiplier
      }
    },
    {
      $project:{
        distance:1, //1 means want to keep the data
        name:1
      }
    }
  ]);

  res.status(200).json({
    status:'success',
    data:{ 
      data:distance
    }
  })
})