/* eslint-disable */
// const fs = require("fs")
const Tour = require('./../models/tourmodel');
const APIFeatures = require("./utils/ApiFeat")
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
