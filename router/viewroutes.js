/*eslint-disable*/
const express=  require('express');
const router = express.Router();
const {getOverview, getTour,getlogin,getAccounts,updateUserDate} = require('../controlers/viewcontroller')
const { isLoggedin,protects} = require('../controlers/authenticationControlle')

router.get('/',isLoggedin,getOverview)
router.get('/tour/:slug',isLoggedin,getTour);
router.get('/login',isLoggedin,getlogin)

router.get('/me',protects , getAccounts)
router.post('/submit-user-data',protects,updateUserDate )

module.exports = router;