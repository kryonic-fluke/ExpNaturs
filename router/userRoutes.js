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


router.patch('/updatePassword',protects, updatePassword)

router.route('/').get(getAllUsers).post(createUsers);

router
  .route('/:id')
  .get(getAuser)
  .patch(UpdateUser)
  .delete(protects, deleteUser);
module.exports = router;
