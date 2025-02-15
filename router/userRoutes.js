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
  createUsers,
  updateMe,
  deleteMe,
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

router.patch('/updatePassword', protects, updatePassword); //protects make sure that user is loged in


router.patch('/updateMe', protects, updateMe);
router.delete('/deleteMe', protects, deleteMe);

// **Separate route for '/' path:**
router.route('/')
  .get(getAllUsers)
  .post(createUsers);

  router
  .route('/:id')
  .get(getAuser)
  .patch(UpdateUser)
  .delete(protects, deleteUser);
// **Separate route for '/:id' path:**

module.exports = router;


