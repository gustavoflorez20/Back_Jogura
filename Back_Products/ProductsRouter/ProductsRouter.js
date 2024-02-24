var express = require('express')
const {verifyToken} = require('../../Back_User/Usercontrollers/UserController')
var router = express.Router()

const { addProducts, getProducts,  deleteProducts, updateProducts,sendEmailProductos } = require('../ProductsControllers/ProductsController')

router.post('/' ,addProducts);

router.get('/:id?', verifyToken, getProducts);



router.delete('/:id',verifyToken,  deleteProducts);

router.patch('/:id', verifyToken, updateProducts);
router.post('/email', verifyToken, sendEmailProductos);


module.exports = router;

