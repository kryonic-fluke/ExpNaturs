/*eslint-disable*/
const express = require('express');
// const restrictTo = require('./../controlers/authenticationControlle');
const {
  getAllReviews,
  createReview,
} = require('../controlers/reviewController');
const {protects, restrictTo} = require('./../controlers/authenticationControlle');
const router = express.Router();

router
  .route('/')
  .get(getAllReviews)
  .post(protects,restrictTo('user'), createReview);

module.exports = router; 
