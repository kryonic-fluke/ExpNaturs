/* eslint-disable */
const Tour = require('./../models/tourmodel');
const catchasync = require('./utils/catchAsync');
const APIFeatures = require('./utils/ApiFeat');
const AppError = require('./utils/Apperror');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchasync(async (req, res) => {
  //Execute the query

  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getATour = catchasync(async (req, res,next) => {
  const tours = await Tour.findById(req.params.id);
  if(!tours){
    return next(new AppError('No tour found with that Id', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

exports.CreateNewTour = catchasync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tourS: newTour,
    },
  });
});

exports.UpdateTour = catchasync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if(!tour){
    return next(new AppError('No tour found with that Id', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.DeleteTour = catchasync(async (req, res) => {
 const tour= await Tour.findByIdAndDelete(req.params.id);
  if(!tour){
    return next(new AppError('No tour found with that Id', 404))
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

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