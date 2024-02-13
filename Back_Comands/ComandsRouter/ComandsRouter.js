var express = require('express')
const {verifyToken} = require('../../Back_User/Usercontrollers/UserController')
var router = express.Router()

const { addComands, getComands,  deleteComands, updateComands } = require('../ComandsControllers/ComandsController')

router.post('/', verifyToken ,addComands);

router.get('/:id?', verifyToken, getComands);



router.delete('/:id',verifyToken,  deleteComands);

router.patch('/:id', verifyToken, updateComands);


module.exports = router;

