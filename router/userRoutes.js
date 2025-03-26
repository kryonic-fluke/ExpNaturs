/*eslint-disable*/

const express = require('express');
const router = express.Router();

const {
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
} = require('./../controlers/authenticationControlle');
const {
  getAllUsers,
  getAuser,
  UpdateUser,
  deleteUser,
  createUser,
  updateMe,
  deleteMe,
  getMe,
} = require('./../controlers/userControlers');
const {
  signup,
  login,
  protects,
} = require('./../controlers/authenticationControlle');


router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protects) // all the routes after this will be protected, case this is a middleware and all the routes are also middlwares that will run after this  
router.patch('/updatePassword', protects, updatePassword); //protects make sure that user is loged in

router.patch('/updateMe',  updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me',  getMe, getAuser);

// **Separate route for '/' path:**
router.use(restrictTo('admin'))
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getAuser).patch(UpdateUser).delete(deleteUser);
// **Separate route for '/:id' path:**

module.exports = router;
