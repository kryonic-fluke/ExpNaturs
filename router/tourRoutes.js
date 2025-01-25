
const express = require('express')
const {getAllTours,getATour,UpdateTour,DeleteTour,CreateNewTour, checkId} = require("./../controlers/tourControlers")
const fs = require('fs');


const router = express.Router();

router.param("id",checkId)

router.route('/').get(getAllTours).post(CreateNewTour);
router //its a middlware
  .route('/:id')
  .patch(UpdateTour)
  .delete(DeleteTour) 
  .get(getATour);




  

  module.exports = router