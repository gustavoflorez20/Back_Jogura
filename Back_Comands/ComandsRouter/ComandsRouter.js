var express = require('express')
const {verifyToken} = require('../../Back_User/Usercontrollers/UserController')
var router = express.Router()

const { addComands, getComands,  deleteComands,  sendEmailComands } = require('../ComandsControllers/ComandsController')

router.post('/', verifyToken ,addComands);

router.get('/:id?', verifyToken, getComands);



router.delete('/:id',verifyToken,  deleteComands);

router.post('/email', sendEmailComands);


module.exports = router;

