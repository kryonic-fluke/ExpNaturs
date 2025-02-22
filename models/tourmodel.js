/*eslint-disable*/

const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User  = require('./usermodel')
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less than or equal 40 characters'],
      minlength: [10, 'A tour name must have more than or equal 10 characters'],
      // validator:[validator.isAlpha,'Tour name will only contain character']
    },

    slug: String,

    rating: {
      type: Number,
      default: 4.5,
      required: [true, 'A tour must have a rating'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have durations'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have maxGroupSize'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy medium or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      rdefault: 0,
      min: [1, 'Rating must be above 1.0'], //min and max validators also work for dates
      max: [5, 'Rating must be below 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have difficulty'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this points only to the document that is being created , not existing
          //custom validator
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price', //VALUE has the access to the value that was inputed(val)
      },
    },

    summary: {
      type: String,
      trim: true,
    },

    decription: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have image Cover'],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [Date],

    secretTour: {
      default: false,
    },

    startLocation: {
      //geojson to specify geospatical data
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinate: [Number], //number is cordiantes of point, longitude then latitude
      address: String,
      description: String,
    },

    locations: [
      //creating embedded documents using array , inside array new documents are entered
      {
        type: { type: { String, default: 'Point', enum: ['Point'] } },
        coordinate: [Number],
        addresss: String,
        description: String,
        day: Number,
      },
    ],

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

   
  },
  {
    toJSON: { virtuals: true }, //to make virtuals visible
    toObject: { virtuals: true },
  

  },
);
//this property will get created each time we get the data out of the databse
//note this field can not be used for query, cause its not part of the database

// tourSchema.index({price:1}) //setting a sinle field index ,here 1 means creating accending index for price
tourSchema.index({price:1,ratingsAverage:-1}); //setting a sinle field index ,here 1 means creating accending index for price
tourSchema.index({slug:1});
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//virtual populate
tourSchema.virtual('tourReviews',{
  ref:'Review',
  foreignField:'tour',   //name of reference of tour in review modal 
  localField:'_id'    // this tour called in local model
})

tourSchema.pre(/^find/, function (next) {
  //to populate the fields guide
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
//pre runs before .save and .create (), documents middleware ,
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // middleware has the access to currently saved middleware this points to the currently processing document
  next();
});

// tourSchema.pre('save', function (next){
// console.log('wecwecwe');
// next();
// })

// //post middleware are exectued after all middleware are completed
// tourSchema.post('save',function(doc,next){
//   console.log(doc);
//   next();
// })

///query middleware , this keyword will point at the document

//to hide secret tour before find query
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find',function(next){
  this.find({ secret: { $ne: true } }); //chaning find query to comming find query
  this.start = Date.now();
  next();
});

// -----------
// tourSchema.pre('save',async function(next){  //embedding the data
//  const guidesPromises =await  this.guides.map(id=>User.findById(id))
// this.guides = await Promise.all(guidesPromises)  ///overriding guides
//  next();
// })     //problem here is that, if user whos id is paased changes its role or other thing , then we would have to refeltct that change in the tour doc aswell
//--------------

tourSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start}milliseconds`);
  console.log(docs);
  next();
});

//aggregation mddleware happens before and after aggregation happens

tourSchema.pre('aggregate', function (next) {
  //here this points to current aggrgation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //to indlue a filter to aggregate, that excludes secretTour
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
