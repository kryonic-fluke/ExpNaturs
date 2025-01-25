
const express = require('express')
const fs = require('fs');
const router = express.Router();
const {getAllTours,getATour,UpdateTour,DeleteTour,CreateNewTour} = require("./../controlers/tourControlers")






router.route('/').get(getAllTours).post(CreateNewTour);
router //its a middlware
  .route('/:id')
  .patch(UpdateTour)
  .delete(DeleteTour) 
  .get(getATour);




  

  module.exports = router