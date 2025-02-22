/*eslint-disable*/

const mongoose = require('mongoose');
const Tour = require('./tourmodel')

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'can not be empty'],
    },
    rating: {
      type: Number,
      default: 0,
      enum: [1, 2, 3, 4, 5],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      select:'name',
      required: [true, 'Review must being to a tour.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,   
      ref: 'User',
      select:'name',
      required: [true, 'review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true }, //to make virtuals visible
    toObject: { virtuals: true },
  },
);


reviewSchema.pre('find', function (next) {
  //   this.populate({
  //       path: 'tour',
  //       select: 'name',
  //   }).populate({
  //       path: 'user',
  //       select: 'name photo',
  //   });
  // next();
      this.populate({
        path: 'user',
        select: 'name photo',
    });
  next();
})

reviewSchema.statics.calcAverageRatings = async function(tourId){  // here this points to model, static method to create a statistic about reviews of a tour
 const stats=  await this.aggregate([
    {
      $match:{tour:tourId}
    },
    {
      $group :{
        _id:'$tour',
        nRating:{$sum:1},
        avgRating:{$avg:'$rating'},

      }
    }
  ])
  // console.log(stats);
 await  Tour.findByIdAndUpdate(tourId,{
    ratingsQuantity:stats[0].nRating,

    ratingsAverage:stats[0].avgRating
  })
}


reviewSchema.post('save',function(){
  //this points to current review 
  this.constructor.calcAverageRatings(this.tour); //tour here is the id ,here constructor will be review model 
  console.log('this is ', this );
  
})

const Review = mongoose.model('Review', reviewSchema);



module.exports = Review;
 

//Post / tour/id/reviews
