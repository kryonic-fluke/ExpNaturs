/*eslint-disable*/
const Tour = require('../models/tourmodel');
const catchAsync  = require('./utils/catchAsync')


exports.getOverview =catchAsync (async(req,res,next)=>{
    //1)get tour data from collection 
        const tours=await Tour.find();
    //2) build template 
    //3)render tmeplate using tour data from 
    res.status(200).render('overview',{
        title:'All Tours',
        tours
    });
})


exports.getTour =catchAsync (async(req,res,next)=>{
    console.log('Requested Slug:', req.params.slug);
    const tour  = await Tour.findOne({slug: req.params.slug}).populate({
        path:'tourReviews',
        select:'review rating user'

    });
    

    res.status(200).render('tour',{
        title:`${tour.name} Tour`,
        tour

    });

    
})

exports.getlogin=catchAsync(async(re1,res,next)=>{
    res.status(200).render('login',{
        title:'Log into your account'
    })
})