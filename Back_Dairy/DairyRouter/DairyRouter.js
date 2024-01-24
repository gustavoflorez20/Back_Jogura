var express = require('express')
const {verifyToken} = require('../../Back_User/Usercontrollers/UserController')
var router = express.Router()

const { addDairy, getDairy,  deleteDairy, updateDairy } = require('../DairyControllers/DairyController')

router.post('/', verifyToken ,addDairy);

router.get('/:id?', verifyToken, getDairy);



router.delete('/:id',verifyToken,  deleteDairy);

router.patch('/:id', verifyToken, updateDairy);


module.exports = router;

