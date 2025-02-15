/*eslint-disable*/
const express = require('express');
const {
  getAllTours,
  getATour,
  UpdateTour,
  DeleteTour,
  CreateNewTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('./../controlers/tourControlers');

const { createReview } = require('./../controlers/reviewController');
const reviewRouter = require('./reviewRoutes')
const {
  protects,
  restrictTo,
} = require('./../controlers/authenticationControlle');
const fs = require('fs');

const router = express.Router();
// router.param("id",checkId)   //when ever url contains id param this middleware will be called

// router
//   .route('/:tourId/reviews')
//   .post(protects, restrictTo('user'), createReview);  it can be implemented like this ,but its kinda messy 


router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protects, getAllTours).post(CreateNewTour);

router
  .route('/:id')
  .patch(UpdateTour)
  .delete(protects, restrictTo('admin', 'lead-guide'), DeleteTour)
  .get(getATour);



module.exports = router;

//POST /TOUR/234WWE/REVIEWS
//GET /tour/23242d2/reviews
//GET /tour/23d232/reiews/23ee2
