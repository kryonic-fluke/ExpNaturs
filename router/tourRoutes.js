
const express = require('express')
const {getAllTours,getATour,UpdateTour,DeleteTour,CreateNewTour, checkId,checkDataExists} = require("./../controlers/tourControlers")
const fs = require('fs');


const router = express.Router();

router.param("id",checkId)   //when ever url contains id param this middleware will be called 

router.route('/')
.get(getAllTours)
.post(checkDataExists,CreateNewTour);



router //its a middlware
  .route('/:id')
  .patch(UpdateTour)
  .delete(DeleteTour) 
  .get(getATour);




  

  module.exports = router