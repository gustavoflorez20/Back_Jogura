var express = require('express')
const {verifyToken} = require('../../Back_User/Usercontrollers/UserController')
var router = express.Router()

const { addProducts, getProducts,  deleteProducts, updateProducts } = require('../ProductsControllers/ProductsController')

router.post('/', verifyToken ,addProducts);

router.get('/:id?', verifyToken, getProducts);



router.delete('/:id',verifyToken,  deleteProducts);

router.patch('/:id', verifyToken, updateProducts);


module.exports = router;

