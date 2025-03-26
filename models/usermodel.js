/*eslint-disable*/

const mongoose = require('mongoose');
const validator = require('validator');
const crypto =require('crypto');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String, // path to photo
  },

  role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],
    default:'user'
  },
  password: {
    type: String, // Correct type!
    required: [true, 'Please provide a password'], // More descriptive message
    minlength: [8, 'Password must be at least 8 characters'], // Set a reasonable minimum length
    trim: true, // Trim whitespace
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //The only works save!! and save ,while updating the password this validation will not work
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "password didn't match",
  },

  passwordChangedAt: {
    type: Date,
    select: true, // Explicitly set to true
  },


  passwordResetToken :String,

 passwordResetExpires:Date,
 active:{
  type:Boolean,
  default:true,
  select:false,
 }

});
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } }); 
  next()
});

userSchema.pre('save',function(next){
  if(!this.isModified('password') ||this.isNew) return next();
  this.passwordChangedAt  = Date.now()-1000;
next();
})


userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  //instance method, available in all user document
  return await bcrypt.compare(candidatePassword, userPassword); //return boolean
};

userSchema.methods.changedpasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp= parseInt(this.passwordChangedAt.getTime() /1000,10);
    console.log(changedTimestamp, JWTtimestamp);
    return JWTtimestamp<changedTimestamp;   //gives true if the passord changed after logining in 
  }


  
  return false;  //means user has not changed its password 
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  //hash the password with cost 14
  this.password = await bcrypt.hash(this.password, 14); //asynchronous version
  this.passwordConfirmation = undefined; //passwordconfirmation was only needed for confirmation after that is deleted
});


userSchema.methods.createPasswordResetToken = function (){
 
//this is sent to user before he creates a new paassword
const resetToken = crypto.randomBytes(32).toString('hex');   //this is sent to the user's emial
 this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');   //this set in the databse
  console.log(resetToken,this.passwordResetToken);
 
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;


  return resetToken;  ///returning plane text token 
}
const User = mongoose.model('User', userSchema);
module.exports = User;

 