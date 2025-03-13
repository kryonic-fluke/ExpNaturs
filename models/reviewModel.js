/*eslint-disable*/

const mongoose = require('mongoose');
const Tour = require('./tourmodel');

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
      select: 'name',
      required: [true, 'Review must being to a tour.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      select: 'name',
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
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // here this points to model, static method to create a statistic about reviews of a tour
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, //Filters the reviews to only include those that belong to the specified tourId.
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      //here stats are assigned to respective fields in the tour model
      ratingsQuantity: stats[0].nRating,

      ratingsAverage: stats[0].avgRating,
    }); 
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,

      ratingsAverage: 0,
    });
  }
};

reviewSchema.post('save', function () {
  //calling the aggregate function, after saveing the newly crearted document
  //this points to current review
  this.constructor.calcAverageRatings(this.tour); //tour here is the id ,here constructor will be review model
});

//problem with findByIdAndDelete is , this doestn't have the access to document middleware
//using a trick yo get over this problem
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // for queries that dont have the access to ducument middleware , we run this middleware , cause under the hood they are findOne
  const query = this.getQuery(); // Get the query conditions for findOneAnd
  this.r = await this.model.findOne(query); //saving the doc
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(), Note :: we can get the access to the review doc doing this , cause query is alredu executed
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
  } else {
    console.error('Document not found in post middleware!');
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

//Post / tour/id/reviews
