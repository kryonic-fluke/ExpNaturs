/*eslint-disable*/

const APIFeatures = require('./utils/ApiFeat');
const AppError = require('./utils/Apperror');
const catchAsync = require('./utils/catchAsync');

exports.deletOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Model will be replaced by what ever is passed to the function
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that Id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (
  Model, 
) => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that Id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { 
        data: doc,
      },
    });
  });

  exports.createOne = Model=>catchAsync(async (req, res, next) => {
      const newDoc = await Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          tours: newDoc,
        },
  })}) 




  exports.getOne = (Model,popOptions)=>catchAsync(async (req, res,next) => {
      let query =Model.findById(req.params.id);
      if(popOptions) query = query = query.populate(popOptions)
    const doc = await query
  
    if(!doc){
      return next(new AppError('No document found with that Id', 404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        data:doc,
      },
    })
  })


  exports.getAllOne = (Model)=>catchAsync(async (req, res, next) => {
    //Execute the query
    let filter = {}
    if(req.params.tourId) filter = {tour:req.params.tourId}; //to allow nested reviews on tour 
    const features = new APIFeatures(Model.find(filter), req.query)   //adding filter is a small hack
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    
    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });