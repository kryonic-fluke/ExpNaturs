/*eslint-disable*/


const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt =require('bcryptjs')
const userSchema = new mongoose.Schema(
    {
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
          photos: {
            type: String, // path to photo
          },
          password: {
            type: String, // Correct type!
            required: [true, 'Please provide a password'], // More descriptive message
            minlength: [8, 'Password must be at least 8 characters'], // Set a reasonable minimum length
            trim: true, // Trim whitespace
          },
          passwordConfirmation: {
            type: String,
            required: [true,'Please confirm your password'],
            validate:{
              //The only works save!! and save ,while updating the password this validation will not work 
              validator:function(el){
                return el=== this.password;
              }
            },
            message:"password didn't match",
            
          },
        },

    
)

userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();
  //hash the password with cost 14
  this .password=await bcrypt.hash(this.password,14)          //asynchronous version 
  this.passwordConfirmation = undefined; //passwordconfirmation was only needed for confirmation after that is deleted
})

const User = mongoose.model('User',userSchema);
module.exports =User;
