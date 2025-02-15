/*eslint-disable*/

const AppError = require("./utils/Apperror");
const catchAsync = require("./utils/catchAsync");

exports.deletOne = Model=> catchAsync(async (req, res,next) => {    // Model will be replaced by what ever is passed to the function
    const doc= await Model.findByIdAndDelete(req.params.id);
     if(!doc){
       return next(new AppError('No document found with that Id', 404))
     }
     res.status(204).json({
       status: 'success',
       data: null,
     });
   }); 

