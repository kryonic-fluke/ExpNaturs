/*eslint-disable*/
const express=  require('express');
const router = express.Router();
const {getOverview, getTour,getlogin} = require('../controlers/viewcontroller')
const {protects, isLoggedin} = require('../controlers/authenticationControlle')

router.use(isLoggedin);
router.get('/',getOverview)
router.get('/tour/:slug',getTour);
router.get('/login',getlogin)

module.exports = router;