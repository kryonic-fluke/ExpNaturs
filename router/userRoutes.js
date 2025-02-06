/*eslint-disable*/
const express = require('express');
const router = express.Router();
const {getAllUsers,getAuser,UpdateUser,deleteUser,createUsers} = require("./../controlers/userControlers.")
const {signup} = require("./../controlers/authenticationControlle")


router.post('/signup',signup)

router.route('/').get(getAllUsers).post(createUsers);

router.route('/:id').get(getAuser).patch(UpdateUser).delete(deleteUser);
module.exports = router 