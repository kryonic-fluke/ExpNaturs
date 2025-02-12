/*eslint-disable*/
const express = require('express');
const router = express.Router();
const {forgotPassword,resetPassword,updatePassword} = require('./../controlers/authenticationControlle')
const {
  getAllUsers,
  getAuser,
  UpdateUser,
  deleteUser,
  createUsers,
  updateMe,
} = require('./../controlers/userControlers.');
const {
  signup,
  login,
  protects,
} = require('./../controlers/authenticationControlle');

router.post('/signup', signup);
router.post('/login', login);

 router.post('/forgotPassword',forgotPassword)
 router.patch('/resetPassword/:token', resetPassword);


router.patch('/updatePassword',protects, updatePassword)   //protects make sure that user is loged in


router.patch('/updateMe',protects,updateMe)
router.route('/').get(getAllUsers).post(createUsers);

router
  .route('/:id')
  .get(getAuser)
  .patch(UpdateUser)
  .delete(protects, deleteUser);
module.exports = router;
