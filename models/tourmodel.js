/*eslint-disable*/

const mongoose = require('mongoose');
const slugify  =require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },

  slug:String,

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
 
  secretTour:{
    default:false,
  }

},{
  toJSON:{virtuals:true},  //to make virtuals visible 
  toObject:{virtuals:true}
})
//this property will get created each time we get the data out of the databse
//note this field can not be used for query, cause its not part of the database
tourSchema.virtual('durationWeeks').get(function (){
  return this.duration/7  
})

//pre runs before .save and .create (), documents middleware ,  
tourSchema.pre('save', function (next){
this.slug = slugify(this.name,{lower:true, }) // middleware has the access to currently saved middleware this points to the currently processing document
next()
})


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
tourSchema.pre(/^find/,function(next){  
// tourSchema.pre('find',function(next){  
  this.find({secret:{$ne: true}})       //chaning find query to comming find query
  this.start =   Date.now();
  next();  
});

tourSchema.post(/^find/,function(docs,next){
console.log(`query took ${Date.now()- this.start}milliseconds`);
console.log(docs);

  next() 
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;


   