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
  logout
} = require('./../controlers/authenticationControlle');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout',logout)

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);


router.patch('/updatePassword', protects, updatePassword); //protects make sure that user is loged in

router.patch('/updateMe',  protects, updateMe); // ADD protects here - for /updateMe, /deleteMe, /me routes - ensure they are protected too
router.delete('/deleteMe', protects, deleteMe);    // ADD protects here
router.get('/me',  protects, getMe, getAuser);    // ADD protects here


// **Separate route for '/' path - Now apply protects BEFORE restrictTo:**
router.use(protects); // <-- APPLY PROTECTS *FIRST* for routes below that need protection AND role restriction
router.use(restrictTo('admin')) // <-- APPLY restrictTo *SECOND*
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getAuser).patch(UpdateUser).delete(deleteUser);
// **Separate route for '/:id' path:**

module.exports = router;