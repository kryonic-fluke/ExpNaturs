const express = require("express")
const router = express.Router();
const {getAllUsers,getAuser,UpdateUser,deleteUser,createUsers} = require("./../controlers/userControlers.")




router.route('/').get(getAllUsers).post(createUsers);

router.route('/:id').get(getAuser).patch(UpdateUser).delete(deleteUser);
module.exports = router 