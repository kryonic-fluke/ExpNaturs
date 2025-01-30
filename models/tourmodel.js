/*eslint-disable*/

const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  rating: {
    type: Number,
    default: 4.5,
    required: [true, 'A tour must have a rating'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
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
  },

  ratingsAverage: {
    type: Number,
    rdefault: 0,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: [true, 'A tour must have difficulty'],
  },

  priceDiscount: Number,

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


},{
  toJSON:{virtuals:true},  //to make virtuals visible 
  toObject:{virtuals:true}
})
//this property will get created each time we get the data out of the databse
//note this field can not be used for query, cause its not part of the database
tourSchema.virtual('durationWeeks').get(function (){
  return this.duration/7  
})
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
