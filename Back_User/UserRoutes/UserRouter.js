var express = require('express')
var router = express.Router()

const { addUser, checkUser,getUser,deleteUser,updateUser } = require('../Usercontrollers/UserController')


router.post('/', addUser)
router.post('/login', checkUser)
router.get('/usuarios', getUser);
router.delete('/:id',  deleteUser);
router.patch('/:id',  updateUser);

module.exports = router

