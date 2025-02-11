/*eslint-disable*/
const express = require('express');
const router = express.Router();
const {forgotPassword,resetPassword} = require('./../controlers/authenticationControlle')
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
 router.post('/resetPassword', resetPassword);


router.route('/').get(getAllUsers).post(createUsers);

router
  .route('/:id')
  .get(getAuser)
  .patch(UpdateUser)
  .delete(protects, deleteUser);
module.exports = router;
