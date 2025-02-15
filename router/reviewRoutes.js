/*eslint-disable*/
const express = require('express');
// const restrictTo = require('./../controlers/authenticationControlle');
const {
  getAllReviews,
  createReview,
  deleteReview,
  UpdateReview,
  setTourUserIds,
  getReview,
} = require('../controlers/reviewController');
const {
  protects,
  restrictTo,
} = require('./../controlers/authenticationControlle');


const router = express.Router({ mergeParams: true }); // when this reviewRouter is mounted, inherit (merge) any route parameters that were defined in the path where it's being mounted.'
router.use(protects);
router
  .route('/')
  .get(getAllReviews)
  .post( restrictTo('user'), setTourUserIds, createReview);

router.route('/:id').delete(restrictTo('user','admin'),deleteReview).patch(restrictTo('user','admin'),UpdateReview).get(getReview);
module.exports = router;
