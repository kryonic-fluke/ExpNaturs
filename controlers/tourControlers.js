/* eslint-disable */
// const fs = require("fs")
const Tour = require('./../models/tourmodel');
const APIFeatures = require('./utils/ApiFeat');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//2) Route handlers------------------------------
exports.getAllTours = async (req, res) => {
  try {
    //Execute the query
    console.log(req.query);

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
  } catch (err) {
    console.log('Error occurred:', err);

    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// -------------------------------------------------------------------
//var is id, multiple ids can be defined /:var/x/y, vars can be made optional using "?"
//can create new version of api to do some changes , function is called a route handler
//console.log(req.params); //req.params gets the value of var

exports.getATour = async (req, res) => {
  try {
    const tours = await Tour.findById(req.params.id); //equivalent to Tour.findOne({_id:req.params.id})
    // const tour = tours.find((el) => el.id === id);
    res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.meggage,
    });
  }
};

//-----------------------------------------------------------

exports.CreateNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body); //calling method on model itself
    console.log(req.body);

    res.status(201).json({
      //showing the newTour
      status: 'success',
      data: {
        tourS: newTour,
      }, //this data will be received by the client
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// -------------------------------------------------------------

exports.UpdateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// -----------------------------------------------------------------

exports.DeleteTour = async (req, res) => {
  try {
    await Tour.findByIdDelete(req.params.id);
    res.status(204).json({
      status: 'sucess',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }, //stage filters documents based on specified criteria
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
      }, //1 for asccending

      // {
      //   match: { _id: { $ne: 'EASY' } },
      // },
      
    
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getMonthlyPlan = async (req,res)=>{
  try{
      const year = req.params.year *1;
      const plan =await Tour.aggregate([

        {
          $unwind: '$startDates'  //deconstructs each document
        },

        {
          $match: {
            startDates:{
              $gte: new Date(`${year}-01-01`),
              $lte:new Date(`${year}-12-31`)
            }
          }
        },

        {
          $group:{
            _id:{$month: '$startDates'},  //all the tours registered in a specific month
            numTourStart :{$sum : 1},  //adds all the tours in the month
            tour:{$push: '$name'}  //forms an arrays of names of tours happening in the month
          }
        },
        {$addFields:{
          month:'$_id'
        }},

        {
          $project:{
            _id:0         //0 means don't show the field, 1 means show the field 
          }
        },


        {
          $sort:{
            numTourStart:-1
          }
        },

        {
          $limit:6  //limit the number of document 
        }

      ])
      res.status(200).json({
        status: 'success',
        data: {
          plan,
        },
      });
  }
 
  
  catch(err){
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
}