/*eslint-disable*/
const express = require('express')
const {getAllTours,getATour,UpdateTour,DeleteTour,CreateNewTour} = require("./../controlers/tourControlers")
const fs = require('fs');


const router = express.Router();

// router.param("id",checkId)   //when ever url contains id param this middleware will be called 

router.route('/')
.get(getAllTours)
.post(CreateNewTour);



router //its a middlware
  .route('/:id')
  .patch(UpdateTour)
  .delete(DeleteTour) 
  .get(getATour);




  

  module.exports = router