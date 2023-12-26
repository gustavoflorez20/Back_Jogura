const express = require('express')
const router = express.Router()

const { addUser, getUser,  deleteUser, updateUser } = require('../Usercontrollers/UserController')

router.post('/', addUser);

router.get('/', getUser);



router.delete('/:id',  deleteUser);

router.patch('/:id',  updateUser);


module.exports = router;

